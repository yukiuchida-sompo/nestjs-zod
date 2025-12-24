import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePost, UpdatePost, SearchPosts } from './posts.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(searchDto: SearchPosts) {
    const { filter, sort, pagination } = searchDto;
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 20;
    const skip = (page - 1) * limit;

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

    // Build orderBy
    const sortField = sort?.field ?? 'createdAt';
    const sortOrder = sort?.order ?? 'desc';
    const orderBy: Prisma.PostOrderByWithRelationInput = {
      [sortField]: sortOrder,
    };

    const [data, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
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
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async create(data: CreatePost) {
    return this.prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        published: data.published ?? false,
        author: {
          connect: { id: data.authorId },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdatePost) {
    await this.findOne(id);
    return this.prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.post.delete({
      where: { id },
    });
  }

  async publish(id: string) {
    await this.findOne(id);
    return this.prisma.post.update({
      where: { id },
      data: { published: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async unpublish(id: string) {
    await this.findOne(id);
    return this.prisma.post.update({
      where: { id },
      data: { published: false },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
