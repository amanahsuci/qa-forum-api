import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'johndoe', description: 'Unique username' })
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    username: string;

    @ApiProperty({ example: 'johndoe@example.com', description: 'Valid email address' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'Password (min 6 characters)' })
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters' })
    password: string;
}

export class LoginDto {
    @ApiProperty({ example: 'johndoe@example.com', description: 'Your email address' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'Your password' })
    @IsString()
    password: string;
}   