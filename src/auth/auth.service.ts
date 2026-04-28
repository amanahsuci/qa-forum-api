import { 
    Injectable,
    ConflictException,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) {}

    async register(dto: RegisterDto) {
        const existingEmail = await this.prisma.user.findUnique({
            where: { email: dto.email },
        })
        if (existingEmail) {
            throw new ConflictException('Email is already registered');
        }

        const existingUsername = await this.prisma.user.findUnique({
            where: { username: dto.username },
        })
        if (existingUsername) {
            throw new ConflictException('Username is already taken');
        }

        const passwordHash = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                passwordHash,
            },
        });

        return {
            message: 'User registered successfully',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
        };
    }

    async login(dto: LoginDto) {
        const foundUser = await this.prisma.user.findUnique({
            where : { email: dto.email },
        });

        if (!foundUser) {
            throw new UnauthorizedException('Invalid email or password');   
        }

        const isPasswordValid = await bcrypt.compare(dto.password, foundUser.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const paylaod = { sub: foundUser.id, email: foundUser.email };
        const token = this.jwtService.sign(paylaod);

        return {
            message: 'Login successful',
            accesToken: token,
            user: {
                id: foundUser.id,
                username: foundUser.username,
                email: foundUser.email,
            },
        };
    }
}