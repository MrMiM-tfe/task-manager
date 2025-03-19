import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create.dto";
import { User, UserRole } from "../user/entities/user.entity";
import { EditTaskDto } from "./dto/edit.dto";

@Injectable()
export class TaskService {
	constructor(
		@InjectRepository(Task) private readonly taskRepository: Repository<Task>,
	) {}
	
	async findAll(): Promise<Task[]> {
		return await this.taskRepository.find();
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
	
	async getUserTasks(userId: number): Promise<Task[]> {
		return await this.taskRepository.find({
			where: {
				user: {
					id: userId
				}
			}
		});
	}
	
	async create(dto:CreateTaskDto, user:User) {
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
}
