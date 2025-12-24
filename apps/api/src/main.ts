import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { AppModule } from './app.module';

async function bootstrap() {
  // Patch NestJS Swagger to support Zod schemas
  patchNestjsSwagger();

  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Setup Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('NestJS Zod Prisma API')
    .setDescription('API with auto-generated TypeScript client')
    .setVersion('1.0')
    .addTag('users')
    .addTag('posts')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api`);
}

bootstrap();

