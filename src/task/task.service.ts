import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create.dto";
import { User, UserRole } from "../user/entities/user.entity";
import { EditTaskDto } from "./dto/edit.dto";
import { FileService } from "../file/file.service";
import { PaginatedDataDto } from "../common/dto/paginated-data.dto";

@Injectable()
export class TaskService {
	constructor(
		@InjectRepository(Task) private readonly taskRepository: Repository<Task>,
		private readonly fileService: FileService,
	) {}
	
	async findAll(page: number = 1, pageSize: number = 10) {
		const skip = (page - 1) * pageSize;
		
		const [data, total] = await this.taskRepository.findAndCount({
			skip,
			take: pageSize,
		});
		
		const totalPages = Math.ceil(total / pageSize);
		
		const response: PaginatedDataDto<Task> = {
			data,
			page,
			pageSize,
			totalPages,
		}
		
		return response;
	}
	
	async adminFindOne(id: number): Promise<Task> {
		return await this.taskRepository.findOneBy({id})
	}
	
	async findOne(id: number, user: User): Promise<Task> {
		const task = await this.taskRepository.findOne({
			where: { id },
			relations: ['user']
		})
		
		if (!task) throw new NotFoundException("Task not found");
		
		if (task.user.id !== user.id) throw new NotFoundException("Task not found");
		
		return task;
	}
	
	async getUserTasks(userId: number, page: number = 1, pageSize: number = 10) {
		const skip = (page - 1) * pageSize;
		
		const [data, total] = await this.taskRepository.findAndCount({
			where: {
				user: {
					id: userId
				}
			},
			skip,
			take: pageSize
		});
		
		const totalPages = Math.ceil(total / pageSize);
		
		const response: PaginatedDataDto<Task> = {
			data,
			page,
			pageSize,
			totalPages,
		}
		
		return response;
	}
	
	async create(dto:CreateTaskDto, user:User) {
		await this.validateAttachments(dto, user);
		return await this.taskRepository.save({ ...dto, user });
	}
	
	async edit(id: number, dto:EditTaskDto, user:User) {
		const task = await this.taskRepository.findOne({
			where: {id},
			relations: ['user'],
		})
		if (!task) throw new NotFoundException("Task not found");
		
		if (user.role !== UserRole.ADMIN && user.id !== task.user.id) {
			throw new ForbiddenException("You don't have permission to edit this task");
		}
		
		await this.validateAttachments(dto, user);
		
		const updatedTask = this.taskRepository.merge(task, dto);
		return await this.taskRepository.save(updatedTask);
	}
	
	async deleteTask(id: number, user:User) {
		const task = await this.taskRepository.findOne({
			where: {id},
			relations: ['user'],
		})
		if (!task) throw new NotFoundException("Task not found");
		
		if (user.role !== UserRole.ADMIN && user.id !== task.user.id) {
			throw new ForbiddenException("You don't have permission to edit this task");
		}
		
		await this.taskRepository.delete(id);
		
		return task
	}
	
	private async validateAttachments(dto: EditTaskDto, user: User) {
		if (dto.attachmentIds) {
			dto.attachment = []
			for (const attachmentId of dto.attachmentIds) {
				const file = await this.fileService.getFile(attachmentId, user)
				if (file) {
					dto.attachment.push(file);
				}
			}
		}
	}
}
