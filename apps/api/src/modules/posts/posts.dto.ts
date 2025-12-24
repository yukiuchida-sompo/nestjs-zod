import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

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
    total: z.number().int(),
  }),
  {
    title: 'PostsList',
    description: 'Paginated list of posts',
  }
);

// Create DTO classes from Zod schemas
export class CreatePostDto extends createZodDto(CreatePostSchema) {}
export class UpdatePostDto extends createZodDto(UpdatePostSchema) {}
export class PostDto extends createZodDto(PostSchema) {}
export class PostWithAuthorDto extends createZodDto(PostWithAuthorSchema) {}
export class PostsListDto extends createZodDto(PostsListSchema) {}

// Type exports
export type Post = z.infer<typeof PostSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;
export type PostWithAuthor = z.infer<typeof PostWithAuthorSchema>;
export type PostsList = z.infer<typeof PostsListSchema>;

