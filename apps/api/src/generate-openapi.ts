import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestjsSwagger } from '@anatine/zod-nestjs';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { AppModule } from './app.module';

async function generateOpenApi() {
  patchNestjsSwagger();

  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('NestJS Zod Prisma API')
    .setDescription('API with auto-generated TypeScript client')
    .setVersion('1.0')
    .addTag('users')
    .addTag('posts')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Write OpenAPI spec to file
  const outputPath = resolve(__dirname, '../openapi.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2));
  console.log(`✅ OpenAPI spec written to ${outputPath}`);

  await app.close();
}

generateOpenApi();

