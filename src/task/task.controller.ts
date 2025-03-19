import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req } from "@nestjs/common";
import { TaskService } from "./task.service";
import { Request } from "express";
import { AdminOnly } from "../common/decorators/admin.decorator";
import { CreateTaskDto } from "./dto/create.dto";
import { EditTaskDto } from "./dto/edit.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Task } from "./entities/task.entity";

@Controller('task')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}
	
	@AdminOnly("Get all tasks")
	@ApiResponse({
		status: HttpStatus.OK,
		type: [Task],
	})
	@Get("/admin")
	async getAllTasks() {
		return await this.taskService.findAll()
	}
	
	@AdminOnly('Get single task')
	@ApiResponse({
		status: HttpStatus.OK,
		type: Task,
	})
	@Get("/admin/:id")
	async adminGetTask(@Param("id") id: number) {
		return await this.taskService.adminFindOne(id)
	}
	
	@ApiOperation({
		summary: "Get all tasks",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: [Task],
	})
	@Get()
	async getTasks(@Req() req: Request) {
		return await this.taskService.getUserTasks(req.user.id);
	}
	
	@ApiOperation({
		summary: "Get single task",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: Task,
	})
	@Get(':id')
	async getTask(@Param("id") id: number, @Req() req: Request) {
		return await this.taskService.findOne(id, req.user);
	}
	
	@ApiOperation({
		summary: "Add task",
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: Task,
	})
	@Post()
	async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
		return await this.taskService.create(createTaskDto, req.user);
	}
	
	@ApiOperation({
		summary: "Update task",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: Task,
	})
	@Patch(':id')
	async editTask(@Param("id") id: number, @Req() req: Request, @Body() editTaskDto: EditTaskDto) {
		return await this.taskService.edit(id, editTaskDto, req.user);
	}
	
	@ApiOperation({
		summary: "Delete task",
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: Task
	})
	@Delete(':id')
	async deleteTask(@Param("id") id: number, @Req() req: Request) {
		return await this.taskService.deleteTask(id, req.user);
	}
}
