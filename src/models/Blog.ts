import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';

import { inputBlogObject } from '../helpers/InputTypes';

const prisma = new PrismaClient();

export default class Blog {
    static getAll() {
        return prisma.blog.findMany();
    }

    static async getRandom() {
        const skip = Math.floor(Math.random() * (await prisma.blog.count()));
        return prisma.blog.findMany({
            take: 1,
            skip,
        });
    }

    static getTotal() {
        return prisma.blog.count();
    }

    static getById(blog_id: string) {
        return prisma.blog.findUnique({
            where: {
                id: blog_id,
            },
        });
    }

    static searchTitle(blogTitle: string) {
        return prisma.blog.findMany({
            where: {
                title: {
                    contains: blogTitle,
                    mode: 'insensitive',
                },
            },
        });
    }

    static create(blogObject: inputBlogObject) {
        return prisma.blog.create({
            data: {
                title: blogObject.title,
                image: blogObject.image,
                category: blogObject.category,
                slug: slugify(blogObject.title),
                resume: blogObject.resume,
                body: blogObject.body,
            },
        });
    }

    static update(blogObject: inputBlogObject) {
        return prisma.blog.update({
            where: {
                id: blogObject.id,
            },
            data: {
                id: blogObject.id,
                title: blogObject.title,
                image: blogObject.image,
                category: blogObject.category,
                slug: blogObject.slug,
                resume: blogObject.resume,
                body: blogObject.body,
                updated_at: new Date(),
            },
        });
    }

    static delete(blog_id: string) {
        return prisma.blog.delete({
            where: {
                id: blog_id,
            },
        });
    }

    static getPostsByPageLimit(page: number, blogPostsPerPage: number) {
        const offset = parseInt(page * blogPostsPerPage - blogPostsPerPage);
        const getUntil = parseInt(page * blogPostsPerPage);
        return prisma.blog.findMany({
            skip: offset,
            take: getUntil,
        });
    }

    static getBySlug(slug: string) {
        return prisma.blog.findUnique({
            where: {
                slug,
            },
        });
    }
}
