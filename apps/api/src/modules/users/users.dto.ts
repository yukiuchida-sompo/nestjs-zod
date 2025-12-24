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

// Base User response schema
export const UserOutputSchema = extendApi(
  z.object({
    id: z.string().cuid(),
    email: z.string().email(),
    name: z.string().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  }),
  {
    title: 'UserOutputDto',
    description: 'A user entity response',
  }
);

// User with posts response
export const UserWithPostsOutputSchema = extendApi(
  UserOutputSchema.extend({
    posts: z.array(
      z.object({
        id: z.string().cuid(),
        title: z.string(),
        published: z.boolean(),
      })
    ),
  }),
  {
    title: 'UserWithPostsOutputDto',
    description: 'A user entity with related posts',
  }
);

// Paginated users list response
export const UsersListOutputSchema = extendApi(
  z.object({
    data: z.array(UserOutputSchema),
    total: z.number().int().describe('Total number of matching records'),
    page: z.number().int().describe('Current page number'),
    limit: z.number().int().describe('Items per page'),
    totalPages: z.number().int().describe('Total number of pages'),
  }),
  {
    title: 'UsersListOutputDto',
    description: 'Paginated list of users response',
  }
);

// ============================================
// Request Schemas (Input DTOs)
// ============================================

// Search Users input
export const SearchUsersInputSchema = extendApi(
  z.object({
    filter: z.object({
      id: z.string().cuid().optional().describe('Filter by exact ID'),
      email: StringFilterSchema.optional().describe('Email filter conditions'),
      name: NullableStringFilterSchema.optional().describe('Name filter conditions'),
      createdAt: DateFilterSchema.optional().describe('Creation date filter'),
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
    title: 'SearchUsersInputDto',
    description: 'Search criteria for users with complex nested conditions',
  }
);

// Create User input
export const CreateUserInputSchema = extendApi(
  z.object({
    email: z.string().email().describe('User email address'),
    name: z.string().min(1).max(100).optional().describe('User display name'),
  }),
  {
    title: 'CreateUserInputDto',
    description: 'Data required to create a new user',
  }
);

// Update User input
export const UpdateUserInputSchema = extendApi(
  z.object({
    email: z.string().email().optional().describe('User email address'),
    name: z.string().min(1).max(100).nullable().optional().describe('User display name'),
  }),
  {
    title: 'UpdateUserInputDto',
    description: 'Data to update an existing user',
  }
);

// ============================================
// DTO Classes for NestJS
// ============================================

// Input DTOs (Requests)
export class SearchUsersInputDto extends createZodDto(SearchUsersInputSchema) {}
export class CreateUserInputDto extends createZodDto(CreateUserInputSchema) {}
export class UpdateUserInputDto extends createZodDto(UpdateUserInputSchema) {}

// Output DTOs (Responses)
export class UserOutputDto extends createZodDto(UserOutputSchema) {}
export class UserWithPostsOutputDto extends createZodDto(UserWithPostsOutputSchema) {}
export class UsersListOutputDto extends createZodDto(UsersListOutputSchema) {}

// ============================================
// Type Exports
// ============================================

// Input types
export type SearchUsersInput = z.infer<typeof SearchUsersInputSchema>;
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;

// Output types
export type UserOutput = z.infer<typeof UserOutputSchema>;
export type UserWithPostsOutput = z.infer<typeof UserWithPostsOutputSchema>;
export type UsersListOutput = z.infer<typeof UsersListOutputSchema>;
