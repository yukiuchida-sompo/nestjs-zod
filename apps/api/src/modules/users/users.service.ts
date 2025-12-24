import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUser, UpdateUser, SearchUsers } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async search(searchDto: SearchUsers) {
    const { filter, sort, pagination } = searchDto;
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const skip = (page - 1) * limit;

    // Build Prisma where clause from filter
    const where: Prisma.UserWhereInput = {};

    if (filter) {
      if (filter.id) {
        where.id = filter.id;
      }

      if (filter.email) {
        where.email = {};
        if (filter.email.equals) where.email.equals = filter.email.equals;
        if (filter.email.contains) where.email.contains = filter.email.contains;
        if (filter.email.startsWith) where.email.startsWith = filter.email.startsWith;
        if (filter.email.endsWith) where.email.endsWith = filter.email.endsWith;
      }

      if (filter.name) {
        where.name = {};
        if (filter.name.equals !== undefined) where.name.equals = filter.name.equals;
        if (filter.name.contains) where.name.contains = filter.name.contains;
        if (filter.name.startsWith) where.name.startsWith = filter.name.startsWith;
        if (filter.name.endsWith) where.name.endsWith = filter.name.endsWith;
        if (filter.name.isNull !== undefined) {
          where.name = filter.name.isNull ? null : { not: null };
        }
      }

      if (filter.createdAt) {
        where.createdAt = {};
        if (filter.createdAt.gte) where.createdAt.gte = filter.createdAt.gte;
        if (filter.createdAt.lte) where.createdAt.lte = filter.createdAt.lte;
        if (filter.createdAt.gt) where.createdAt.gt = filter.createdAt.gt;
        if (filter.createdAt.lt) where.createdAt.lt = filter.createdAt.lt;
      }

      if (filter.posts) {
        if (filter.posts.some) {
          where.posts = {
            some: {
              published: filter.posts.some.published,
            },
          };
        }
        if (filter.posts.none) {
          where.posts = {
            none: {
              published: filter.posts.none.published,
            },
          };
        }
      }
    }

    // Build orderBy
    const sortField = sort?.field ?? 'createdAt';
    const sortOrder = sort?.order ?? 'desc';
    const orderBy: Prisma.UserOrderByWithRelationInput = {
      [sortField]: sortOrder,
    };

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            published: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async create(data: CreateUser) {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: UpdateUser) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
