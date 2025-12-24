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
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { PostsService } from './posts.service';
import {
  SearchPostsInputDto,
  CreatePostInputDto,
  UpdatePostInputDto,
  PostWithAuthorOutputDto,
  PostsListOutputDto,
} from './posts.dto';

@ApiTags('posts')
@Controller('posts')
@UsePipes(ZodValidationPipe)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search posts with complex filters' })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of posts matching the search criteria',
    type: PostsListOutputDto,
  })
  async search(@Body() searchDto: SearchPostsInputDto): Promise<PostsListOutputDto> {
    return this.postsService.search(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post details with author',
    type: PostWithAuthorOutputDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id') id: string): Promise<PostWithAuthorOutputDto> {
    return this.postsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: PostWithAuthorOutputDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createPostDto: CreatePostInputDto): Promise<PostWithAuthorOutputDto> {
    return this.postsService.create(createPostDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: PostWithAuthorOutputDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostInputDto
  ): Promise<PostWithAuthorOutputDto> {
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
    type: PostWithAuthorOutputDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async publish(@Param('id') id: string): Promise<PostWithAuthorOutputDto> {
    return this.postsService.publish(id);
  }

  @Patch(':id/unpublish')
  @ApiOperation({ summary: 'Unpublish a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post unpublished successfully',
    type: PostWithAuthorOutputDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async unpublish(@Param('id') id: string): Promise<PostWithAuthorOutputDto> {
    return this.postsService.unpublish(id);
  }
}
