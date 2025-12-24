import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { PostsService } from './posts.service';
import {
  CreatePostDto,
  UpdatePostDto,
  PostWithAuthorDto,
  PostsListDto,
} from './posts.dto';

@ApiTags('posts')
@Controller('posts')
@UsePipes(ZodValidationPipe)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({ name: 'published', required: false, type: Boolean, description: 'Filter by published status' })
  @ApiResponse({
    status: 200,
    description: 'List of posts',
    type: PostsListDto,
  })
  async findAll(@Query('published') published?: string): Promise<PostsListDto> {
    const publishedOnly = published === 'true';
    return this.postsService.findAll(publishedOnly);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post details with author',
    type: PostWithAuthorDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id') id: string): Promise<PostWithAuthorDto> {
    return this.postsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostWithAuthorDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createPostDto: CreatePostDto): Promise<PostWithAuthorDto> {
    return this.postsService.create(createPostDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostWithAuthorDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<PostWithAuthorDto> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 204, description: 'Post deleted successfully' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.postsService.remove(id);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Publish a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post published successfully',
    type: PostWithAuthorDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async publish(@Param('id') id: string): Promise<PostWithAuthorDto> {
    return this.postsService.publish(id);
  }

  @Patch(':id/unpublish')
  @ApiOperation({ summary: 'Unpublish a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post unpublished successfully',
    type: PostWithAuthorDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async unpublish(@Param('id') id: string): Promise<PostWithAuthorDto> {
    return this.postsService.unpublish(id);
  }
}
