import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

// Pagination schema (reusable)
export const PaginationSchema = z.object({
  page: z.number().int().min(1).optional().default(1).describe('Page number (1-indexed)'),
  limit: z.number().int().min(1).max(100).optional().default(20).describe('Number of items per page'),
});

// Sort order schema
export const SortOrderSchema = z.enum(['asc', 'desc']).optional().default('desc');

// Base User schema
export const UserSchema = extendApi(
  z.object({
    id: z.string().cuid(),
    email: z.string().email(),
    name: z.string().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
  {
    title: 'User',
    description: 'A user entity',
  }
);

// Search User DTO - supports complex nested conditions
export const SearchUsersSchema = extendApi(
  z.object({
    filter: z.object({
      id: z.string().cuid().optional().describe('Filter by exact ID'),
      email: z.object({
        equals: z.string().email().optional().describe('Exact email match'),
        contains: z.string().optional().describe('Email contains this string'),
        startsWith: z.string().optional().describe('Email starts with this string'),
        endsWith: z.string().optional().describe('Email ends with this string'),
      }).optional().describe('Email filter conditions'),
      name: z.object({
        equals: z.string().nullable().optional().describe('Exact name match'),
        contains: z.string().optional().describe('Name contains this string'),
        startsWith: z.string().optional().describe('Name starts with this string'),
        endsWith: z.string().optional().describe('Name ends with this string'),
        isNull: z.boolean().optional().describe('Filter by null/not null'),
      }).optional().describe('Name filter conditions'),
      createdAt: z.object({
        gte: z.coerce.date().optional().describe('Created at or after this date'),
        lte: z.coerce.date().optional().describe('Created at or before this date'),
        gt: z.coerce.date().optional().describe('Created after this date'),
        lt: z.coerce.date().optional().describe('Created before this date'),
      }).optional().describe('Creation date filter'),
      posts: z.object({
        some: z.object({
          published: z.boolean().optional().describe('Has posts with this publish status'),
        }).optional().describe('Has at least one post matching'),
        none: z.object({
          published: z.boolean().optional().describe('Has no posts with this publish status'),
        }).optional().describe('Has no posts matching'),
      }).optional().describe('Filter by related posts'),
    }).optional().describe('Filter conditions'),
    sort: z.object({
      field: z.enum(['id', 'email', 'name', 'createdAt', 'updatedAt']).optional().default('createdAt'),
      order: SortOrderSchema,
    }).optional().describe('Sorting options'),
    pagination: PaginationSchema.optional(),
  }),
  {
    title: 'SearchUsers',
    description: 'Search criteria for users with complex nested conditions',
  }
);

// Create User DTO
export const CreateUserSchema = extendApi(
  z.object({
    email: z.string().email().describe('User email address'),
    name: z.string().min(1).max(100).optional().describe('User display name'),
  }),
  {
    title: 'CreateUser',
    description: 'Data required to create a new user',
  }
);

// Update User DTO
export const UpdateUserSchema = extendApi(
  z.object({
    email: z.string().email().optional().describe('User email address'),
    name: z.string().min(1).max(100).nullable().optional().describe('User display name'),
  }),
  {
    title: 'UpdateUser',
    description: 'Data to update an existing user',
  }
);

// User with posts
export const UserWithPostsSchema = UserSchema.extend({
  posts: z.array(
    z.object({
      id: z.string().cuid(),
      title: z.string(),
      published: z.boolean(),
    })
  ),
});

// Response schemas
export const UsersListSchema = extendApi(
  z.object({
    data: z.array(UserSchema),
    total: z.number().int().describe('Total number of matching records'),
    page: z.number().int().describe('Current page number'),
    limit: z.number().int().describe('Items per page'),
    totalPages: z.number().int().describe('Total number of pages'),
  }),
  {
    title: 'UsersList',
    description: 'Paginated list of users',
  }
);

// Create DTO classes from Zod schemas
export class SearchUsersDto extends createZodDto(SearchUsersSchema) {}
export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
export class UserDto extends createZodDto(UserSchema) {}
export class UserWithPostsDto extends createZodDto(UserWithPostsSchema) {}
export class UsersListDto extends createZodDto(UsersListSchema) {}

// Type exports
export type SearchUsers = z.infer<typeof SearchUsersSchema>;
export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UserWithPosts = z.infer<typeof UserWithPostsSchema>;
export type UsersList = z.infer<typeof UsersListSchema>;
