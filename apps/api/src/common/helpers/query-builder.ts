/**
 * Sort options type for search queries
 */
export interface SortOptions<T extends string = string> {
  field?: T;
  order?: 'asc' | 'desc';
}

/**
 * Builds an orderBy object for Prisma queries
 * @param sort - Sort options containing field and order
 * @param defaultField - Default field to sort by (default: 'createdAt')
 * @param defaultOrder - Default sort order (default: 'desc')
 * @returns Prisma-compatible orderBy object
 */
export function buildOrderBy<T extends string = string>(
  sort: SortOptions<T> | undefined,
  defaultField: T = 'createdAt' as T,
  defaultOrder: 'asc' | 'desc' = 'desc'
): Record<string, 'asc' | 'desc'> {
  const field = sort?.field ?? defaultField;
  const order = sort?.order ?? defaultOrder;
  return { [field]: order };
}

/**
 * Pagination options type
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

/**
 * Builds pagination parameters for Prisma queries
 * @param pagination - Pagination options
 * @param defaultLimit - Default items per page (default: 20)
 * @returns Object containing skip, take, page, and limit
 */
export function buildPagination(
  pagination: PaginationOptions | undefined,
  defaultLimit = 20
): { skip: number; take: number; page: number; limit: number } {
  const page = pagination?.page ?? 1;
  const limit = pagination?.limit ?? defaultLimit;
  const skip = (page - 1) * limit;
  return { skip, take: limit, page, limit };
}

/**
 * Builds paginated response object
 * @param data - Array of data items
 * @param total - Total count of matching records
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Paginated response object
 */
export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): { data: T[]; total: number; page: number; limit: number; totalPages: number } {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

