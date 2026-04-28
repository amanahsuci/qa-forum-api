import {
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThreadDto, UpdateThreadDto } from './dto/threads.dto';

@Injectable()
export class ThreadsService {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, dto: CreateThreadDto) {
        const thread = await this.prisma.thread.create({
            data: {
                title: dto.title,
                content: dto.content,
                userId,
            },
            include: {
                user: {
                    select: { id: true, username: true },
                },
            },
        });
    
        return { message: 'Thread created successfully', thread };
        }

    async findAll() {
        const threads = await this.prisma.thread.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, username: true },
                },
            },
        });

        return { total: threads.length, threads };
    }

    async findMyThreads(userId: string) {
        const threads = await this.prisma.thread.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, username: true },
                },
            },
        });
    
        return { total: threads.length, threads };
    }

    async findOne(id: string) {
        const thread = await this.prisma.thread.findUnique({
            where: { id },
            include: {
                user: {
                    select: { id: true, username: true, email: true },
                },
            },
        });
    
        if (!thread) {
            throw new NotFoundException(`Thread with ID "${id}" not found`);
        }
    
        return thread;
    }

    async update(id: string, userId: string, dto: UpdateThreadDto) {
      // check if thread exists
        const thread = await this.prisma.thread.findUnique({ where: { id } });

        if (!thread) {
            throw new NotFoundException(`Thread with ID "${id}" not found`);
        }

      // check ownership — only the creator can update
        if (thread.userId !== userId) {
            throw new ForbiddenException('You are not allowed to update this thread');
        }

        const updated = await this.prisma.thread.update({
            where: { id },
            data: { ...dto },
            include: {
                user: { select: { id: true, username: true } },
            },
        });

        return { message: 'Thread updated successfully', thread: updated };
    }

    async remove(id: string, userId: string) {
      // check if thread exists
        const thread = await this.prisma.thread.findUnique({ where: { id } });
    
        if (!thread) {
            throw new NotFoundException(`Thread with ID "${id}" not found`);
        }
    
        // check ownership — only the creator can delete
        if (thread.userId !== userId) {
            throw new ForbiddenException('You are not allowed to delete this thread');
        }
    
        await this.prisma.thread.delete({ where: { id } });
    
        return { message: 'Thread deleted successfully' };
    }
}