import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@ApiTags('Task Management')
@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    async getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        return await this.tasksService.getTasks(filterDto, user)
    }

    @Post()
    @UsePipes(ValidationPipe)
    @ApiBody({ type: CreateTaskDto })
    createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user)
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user)
    }

    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.tasksService.deleteTaskById(id, user)
    }

    @Patch('/:id/status')
    @ApiBody({
        schema: {
            example: {
                status: "string"
            }
        },
        description: 'Status Value Should be OPEN | INPROGRESS | DONE'
    })
    updateTaskById(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus, @GetUser() user: User): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user)
    }
}
