import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import {
  PaginationSchema,
  SortOrderSchema,
  StringFilterSchema,
  NullableStringFilterSchema,
  DateFilterSchema,
} from '../../common/schemas';

// Base Post schema
export const PostSchema = extendApi(
  z.object({
    id: z.string().cuid(),
    title: z.string(),
    content: z.string().nullable(),
    published: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    authorId: z.string().cuid(),
  }),
  {
    title: 'Post',
    description: 'A blog post entity',
  }
);

// Post with author
export const PostWithAuthorSchema = PostSchema.extend({
  author: z.object({
    id: z.string().cuid(),
    name: z.string().nullable(),
    email: z.string().email(),
  }),
});

// Search Post DTO - supports complex nested conditions
export const SearchPostsSchema = extendApi(
  z.object({
    filter: z.object({
      id: z.string().cuid().optional().describe('Filter by exact ID'),
      title: StringFilterSchema.optional().describe('Title filter conditions'),
      content: NullableStringFilterSchema.optional().describe('Content filter conditions'),
      published: z.boolean().optional().describe('Filter by publication status'),
      createdAt: DateFilterSchema.optional().describe('Creation date filter'),
      author: z.object({
        id: z.string().cuid().optional().describe('Filter by author ID'),
        email: StringFilterSchema.optional().describe('Author email filter'),
        name: NullableStringFilterSchema.optional().describe('Author name filter'),
      }).optional().describe('Filter by related author'),
    }).optional().describe('Filter conditions'),
    sort: z.object({
      field: z.enum(['id', 'title', 'published', 'createdAt', 'updatedAt']).optional().default('createdAt'),
      order: SortOrderSchema,
    }).optional().describe('Sorting options'),
    pagination: PaginationSchema.optional(),
  }),
  {
    title: 'SearchPosts',
    description: 'Search criteria for posts with complex nested conditions',
  }
);

// Create Post DTO
export const CreatePostSchema = extendApi(
  z.object({
    title: z.string().min(1).max(200).describe('Post title'),
    content: z.string().optional().describe('Post content'),
    published: z.boolean().optional().default(false).describe('Publication status'),
    authorId: z.string().cuid().describe('Author user ID'),
  }),
  {
    title: 'CreatePost',
    description: 'Data required to create a new post',
  }
);

// Update Post DTO
export const UpdatePostSchema = extendApi(
  z.object({
    title: z.string().min(1).max(200).optional().describe('Post title'),
    content: z.string().nullable().optional().describe('Post content'),
    published: z.boolean().optional().describe('Publication status'),
  }),
  {
    title: 'UpdatePost',
    description: 'Data to update an existing post',
  }
);

// Response schemas
export const PostsListSchema = extendApi(
  z.object({
    data: z.array(PostWithAuthorSchema),
    total: z.number().int().describe('Total number of matching records'),
    page: z.number().int().describe('Current page number'),
    limit: z.number().int().describe('Items per page'),
    totalPages: z.number().int().describe('Total number of pages'),
  }),
  {
    title: 'PostsList',
    description: 'Paginated list of posts',
  }
);

// Create DTO classes from Zod schemas
export class SearchPostsDto extends createZodDto(SearchPostsSchema) {}
export class CreatePostDto extends createZodDto(CreatePostSchema) {}
export class UpdatePostDto extends createZodDto(UpdatePostSchema) {}
export class PostDto extends createZodDto(PostSchema) {}
export class PostWithAuthorDto extends createZodDto(PostWithAuthorSchema) {}
export class PostsListDto extends createZodDto(PostsListSchema) {}

// Type exports
export type SearchPosts = z.infer<typeof SearchPostsSchema>;
export type Post = z.infer<typeof PostSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;
export type PostWithAuthor = z.infer<typeof PostWithAuthorSchema>;
export type PostsList = z.infer<typeof PostsListSchema>;
