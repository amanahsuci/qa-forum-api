import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateThreadDto {
    @ApiProperty({
        example: 'How do I set up environment variables in Node.js?',
        description: 'Thread title',
    })
    @IsString()
    @MinLength(5, { message: 'Title must be at least 5 characters' })
    @MaxLength(200, { message: 'Title cannot exceed 200 characters' })
    title: string;

    @ApiProperty({
        example: 'I am new to backend development and confused about how to use dotenv.',
        description: 'Thread content / question body',
    })
    @IsString()
    @MinLength(10, { message: 'Content must be at least 10 characters' })
    content: string;
}

export class UpdateThreadDto {
    @ApiPropertyOptional({
        example: 'Updated: How do I set up environment variables in Node.js?',
        description: 'Updated thread title',
    })
    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    title?: string;

    @ApiPropertyOptional({
        example: 'Updated content here...',
        description: 'Updated thread content',
    })
    @IsOptional()
    @IsString()
    @MinLength(10)
    content?: string;
}