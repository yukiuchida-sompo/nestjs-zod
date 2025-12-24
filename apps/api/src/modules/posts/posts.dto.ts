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

// ============================================
// Response Schemas (Output DTOs)
// ============================================

// Base Post response schema
export const PostOutputSchema = extendApi(
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
    title: 'PostOutputDto',
    description: 'A blog post entity response',
  }
);

// Author nested in post response
const AuthorInPostSchema = z.object({
  id: z.string().cuid(),
  name: z.string().nullable(),
  email: z.string().email(),
});

// Post with author response
export const PostWithAuthorOutputSchema = extendApi(
  PostOutputSchema.extend({
    author: AuthorInPostSchema,
  }),
  {
    title: 'PostWithAuthorOutputDto',
    description: 'A blog post entity with author details',
  }
);

// Paginated posts list response
export const PostsListOutputSchema = extendApi(
  z.object({
    data: z.array(PostWithAuthorOutputSchema),
    total: z.number().int().describe('Total number of matching records'),
    page: z.number().int().describe('Current page number'),
    limit: z.number().int().describe('Items per page'),
    totalPages: z.number().int().describe('Total number of pages'),
  }),
  {
    title: 'PostsListOutputDto',
    description: 'Paginated list of posts response',
  }
);

// ============================================
// Request Schemas (Input DTOs)
// ============================================

// Search Posts input
export const SearchPostsInputSchema = extendApi(
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
    title: 'SearchPostsInputDto',
    description: 'Search criteria for posts with complex nested conditions',
  }
);

// Create Post input
export const CreatePostInputSchema = extendApi(
  z.object({
    title: z.string().min(1).max(200).describe('Post title'),
    content: z.string().optional().describe('Post content'),
    published: z.boolean().optional().default(false).describe('Publication status'),
    authorId: z.string().cuid().describe('Author user ID'),
  }),
  {
    title: 'CreatePostInputDto',
    description: 'Data required to create a new post',
  }
);

// Update Post input
export const UpdatePostInputSchema = extendApi(
  z.object({
    title: z.string().min(1).max(200).optional().describe('Post title'),
    content: z.string().nullable().optional().describe('Post content'),
    published: z.boolean().optional().describe('Publication status'),
  }),
  {
    title: 'UpdatePostInputDto',
    description: 'Data to update an existing post',
  }
);

// ============================================
// DTO Classes for NestJS
// ============================================

// Input DTOs (Requests)
export class SearchPostsInputDto extends createZodDto(SearchPostsInputSchema) {}
export class CreatePostInputDto extends createZodDto(CreatePostInputSchema) {}
export class UpdatePostInputDto extends createZodDto(UpdatePostInputSchema) {}

// Output DTOs (Responses)
export class PostOutputDto extends createZodDto(PostOutputSchema) {}
export class PostWithAuthorOutputDto extends createZodDto(PostWithAuthorOutputSchema) {}
export class PostsListOutputDto extends createZodDto(PostsListOutputSchema) {}

// ============================================
// Type Exports
// ============================================

// Input types
export type SearchPostsInput = z.infer<typeof SearchPostsInputSchema>;
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;
export type UpdatePostInput = z.infer<typeof UpdatePostInputSchema>;

// Output types
export type PostOutput = z.infer<typeof PostOutputSchema>;
export type PostWithAuthorOutput = z.infer<typeof PostWithAuthorOutputSchema>;
export type PostsListOutput = z.infer<typeof PostsListOutputSchema>;
