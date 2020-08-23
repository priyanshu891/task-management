import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepo: TaskRepository
    ) { }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return await this.taskRepo.getTasks(filterDto)
    }


    async getTaskById(id: number): Promise<Task> {
        const taskFound = await this.taskRepo.findOne(id);

        if (!taskFound) {
            throw new NotFoundException(`Task with ID '${id}' not found`);
        }
        return taskFound;
    }


    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.taskRepo.createTask(createTaskDto);
    }

    async deleteTaskById(id: number): Promise<void> {
        const result = await this.taskRepo.delete(id);
        console.log(result);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID '${id}' not found`);
        }
    }

    async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status
        await task.save()
        return task;
    }

}
