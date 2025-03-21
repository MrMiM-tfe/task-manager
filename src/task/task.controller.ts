import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Req } from "@nestjs/common";
import { TaskService } from "./task.service";
import { Request } from "express";
import { AdminOnly } from "../common/decorators/admin.decorator";
import { CreateTaskDto } from "./dto/create.dto";
import { EditTaskDto } from "./dto/edit.dto";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { Task } from "./entities/task.entity";
import { PaginatedTaskDto } from "../common/dto/paginated-data.dto";

@Controller('task')
export class TaskController {
	constructor(private readonly taskService: TaskService) {}
	
	@AdminOnly("Get all tasks")
	@ApiResponse({
		status: HttpStatus.OK,
		type: PaginatedTaskDto,
	})
	@ApiQuery({
		name: "page",
		required: false
	})
	@ApiQuery({
		name: "pageSize",
		required: false
	})
	@Get("/admin")
	async getAllTasks(@Query("page") page:number, @Query("pageSize") pageSize:number) {
		return await this.taskService.findAll(page, pageSize);
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
	@ApiQuery({
		name: "page",
		required: false
	})
	@ApiQuery({
		name: "pageSize",
		required: false
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: PaginatedTaskDto,
	})
	@Get()
	async getTasks(@Req() req: Request, @Query("page") page:number, @Query("pageSize") pageSize:number) {
		return await this.taskService.getUserTasks(req.user.id, page, pageSize);
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
