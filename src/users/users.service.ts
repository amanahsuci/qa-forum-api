import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            _count: {
            select: { threads: true },
            },
        },
    });

    if (!user) {
        throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        totalThreads: user._count.threads,
        };
    }
}