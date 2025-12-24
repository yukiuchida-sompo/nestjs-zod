import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';

// Sort order schema
export const SortOrderSchema = z.enum(['asc', 'desc']).optional().default('desc');
export type SortOrder = z.infer<typeof SortOrderSchema>;

// Pagination schema (reusable)
export const PaginationSchema = extendApi(
  z.object({
    page: z.number().int().min(1).optional().default(1).describe('Page number (1-indexed)'),
    limit: z.number().int().min(1).max(100).optional().default(20).describe('Number of items per page'),
  }),
  {
    title: 'Pagination',
    description: 'Pagination parameters',
  }
);
export type Pagination = z.infer<typeof PaginationSchema>;

// Paginated response helper
export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    total: z.number().int().describe('Total number of matching records'),
    page: z.number().int().describe('Current page number'),
    limit: z.number().int().describe('Items per page'),
    totalPages: z.number().int().describe('Total number of pages'),
  });

// String filter schema (contains, equals, startsWith, endsWith)
export const StringFilterSchema = extendApi(
  z.object({
    equals: z.string().optional().describe('Exact match'),
    contains: z.string().optional().describe('Contains this string'),
    startsWith: z.string().optional().describe('Starts with this string'),
    endsWith: z.string().optional().describe('Ends with this string'),
  }),
  {
    title: 'StringFilter',
    description: 'String filter conditions',
  }
);
export type StringFilter = z.infer<typeof StringFilterSchema>;

// Nullable string filter schema
export const NullableStringFilterSchema = extendApi(
  z.object({
    equals: z.string().nullable().optional().describe('Exact match (can be null)'),
    contains: z.string().optional().describe('Contains this string'),
    startsWith: z.string().optional().describe('Starts with this string'),
    endsWith: z.string().optional().describe('Ends with this string'),
    isNull: z.boolean().optional().describe('Filter by null/not null'),
  }),
  {
    title: 'NullableStringFilter',
    description: 'Nullable string filter conditions',
  }
);
export type NullableStringFilter = z.infer<typeof NullableStringFilterSchema>;

// Date filter schema
export const DateFilterSchema = extendApi(
  z.object({
    gte: z.coerce.date().optional().describe('Greater than or equal to this date'),
    lte: z.coerce.date().optional().describe('Less than or equal to this date'),
    gt: z.coerce.date().optional().describe('Greater than this date'),
    lt: z.coerce.date().optional().describe('Less than this date'),
  }),
  {
    title: 'DateFilter',
    description: 'Date range filter conditions',
  }
);
export type DateFilter = z.infer<typeof DateFilterSchema>;

