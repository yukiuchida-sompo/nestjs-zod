import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostInput, UpdatePostInput, SearchPostsInput } from './posts.dto';
import {
  buildOrderBy,
  buildPagination,
  buildPaginatedResponse,
} from '../../common/helpers/query-builder';

const AUTHOR_SELECT = { id: true, name: true, email: true } as const;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(searchDto: SearchPostsInput) {
    const { filter, sort, pagination } = searchDto;
    const { skip, take, page, limit } = buildPagination(pagination);

    // Build Prisma where clause from filter
    const where: Prisma.PostWhereInput = {};

    if (filter) {
      if (filter.id) {
        where.id = filter.id;
      }

      if (filter.title) {
        where.title = {};
        if (filter.title.equals) where.title.equals = filter.title.equals;
        if (filter.title.contains) where.title.contains = filter.title.contains;
        if (filter.title.startsWith) where.title.startsWith = filter.title.startsWith;
        if (filter.title.endsWith) where.title.endsWith = filter.title.endsWith;
      }

      if (filter.content) {
        if (filter.content.isNull !== undefined) {
          where.content = filter.content.isNull ? null : { not: null };
        } else {
          where.content = {};
          if (filter.content.equals !== undefined) where.content.equals = filter.content.equals;
          if (filter.content.contains) where.content.contains = filter.content.contains;
        }
      }

      if (filter.published !== undefined) {
        where.published = filter.published;
      }

      if (filter.createdAt) {
        where.createdAt = {};
        if (filter.createdAt.gte) where.createdAt.gte = filter.createdAt.gte;
        if (filter.createdAt.lte) where.createdAt.lte = filter.createdAt.lte;
        if (filter.createdAt.gt) where.createdAt.gt = filter.createdAt.gt;
        if (filter.createdAt.lt) where.createdAt.lt = filter.createdAt.lt;
      }

      if (filter.author) {
        where.author = {};
        if (filter.author.id) {
          where.author.id = filter.author.id;
        }
        if (filter.author.email) {
          where.author.email = {};
          if (filter.author.email.equals) where.author.email.equals = filter.author.email.equals;
          if (filter.author.email.contains) where.author.email.contains = filter.author.email.contains;
        }
        if (filter.author.name) {
          where.author.name = {};
          if (filter.author.name.equals !== undefined) where.author.name.equals = filter.author.name.equals;
          if (filter.author.name.contains) where.author.name.contains = filter.author.name.contains;
        }
      }
    }

    const orderBy = buildOrderBy(sort) as Prisma.PostOrderByWithRelationInput;

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: { author: { select: AUTHOR_SELECT } },
        orderBy,
        skip,
        take,
      }),
      this.prisma.post.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: { select: AUTHOR_SELECT } },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async create(data: CreatePostInput) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published ?? false,
        author: { connect: { id: data.authorId } },
      },
      include: { author: { select: AUTHOR_SELECT } },
    });
  }

  async update(id: string, data: UpdatePostInput) {
    await this.findOne(id);
    return this.prisma.post.update({
      where: { id },
      data,
      include: { author: { select: AUTHOR_SELECT } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.post.delete({ where: { id } });
  }

  async publish(id: string) {
    await this.findOne(id);
    return this.prisma.post.update({
      where: { id },
      data: { published: true },
      include: { author: { select: AUTHOR_SELECT } },
    });
  }

  async unpublish(id: string) {
    await this.findOne(id);
    return this.prisma.post.update({
      where: { id },
      data: { published: false },
      include: { author: { select: AUTHOR_SELECT } },
    });
  }
}
