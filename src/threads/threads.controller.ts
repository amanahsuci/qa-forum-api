import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiParam,
} from '@nestjs/swagger';
import { ThreadsService } from './threads.service';
import { CreateThreadDto, UpdateThreadDto } from './dto/threads.dto';
import { JwtAuthGuard } from '../auth/guards/jtw-auth.guards';
import { CurrentUser } from '../auth/decorators/current-users.decorator';

@ApiTags('Threads')
@Controller('threads')
export class ThreadsController {
    constructor(private threadsService: ThreadsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Create a new thread (Auth required)' })
    @ApiResponse({ status: 201, description: 'Thread created successfully' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    create(
        @CurrentUser() user: { id: string },
        @Body() dto: CreateThreadDto,
        ) {
        return this.threadsService.create(user.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all threads (Public)' })
    @ApiResponse({ status: 200, description: 'List of all threads' })
    findAll() {
        return this.threadsService.findAll();
    }

    @Get('my-threads')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get threads belonging to the logged-in user (Auth required)' })
    @ApiResponse({ status: 200, description: 'List of user threads' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    findMyThreads(@CurrentUser() user: { id: string }) {
        return this.threadsService.findMyThreads(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific thread by ID (Public)' })
    @ApiParam({ name: 'id', description: 'Thread UUID' })
    @ApiResponse({ status: 200, description: 'Thread details' })
    @ApiResponse({ status: 404, description: 'Thread not found' })
    findOne(@Param('id') id: string) {
        return this.threadsService.findOne(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update a thread (Auth required, owner only)' })
    @ApiParam({ name: 'id', description: 'Thread UUID' })
    @ApiResponse({ status: 200, description: 'Thread updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - not the thread owner' })
    @ApiResponse({ status: 404, description: 'Thread not found' })
    update(
        @Param('id') id: string,
        @CurrentUser() user: { id: string },
        @Body() dto: UpdateThreadDto,
    ) {
        return this.threadsService.update(id, user.id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Delete a thread (Auth required, owner only)' })
    @ApiParam({ name: 'id', description: 'Thread UUID' })
    @ApiResponse({ status: 200, description: 'Thread deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - not the thread owner' })
    @ApiResponse({ status: 404, description: 'Thread not found' })
    remove(
        @Param('id') id: string,
        @CurrentUser() user: { id: string },
    ) {
        return this.threadsService.remove(id, user.id);
    }
}