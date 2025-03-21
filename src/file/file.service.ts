import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FileInfo } from "./entities/file-info.entity";
import { Repository } from "typeorm";
import { ResetFileDto } from "./dto/register-file.dto";
import { User, UserRole } from "../user/entities/user.entity";
import * as fs from 'fs/promises';
import { PaginatedDataDto } from "../common/dto/paginated-data.dto";

@Injectable()
export class FileService {
	constructor(@InjectRepository(FileInfo) private readonly fileRepository: Repository<FileInfo>) {}
	
	async register(dto: ResetFileDto) {
		return await this.fileRepository.save(dto)
	}
	
	async getFile(id: number, user: User) {
		const file = await this.fileRepository.findOne({
			where: {id},
			relations: ['user'],
		})
		if (!file) throw new NotFoundException(`File with id ${id} not found`)
		
		if (!file.isPublic && user.role !== UserRole.ADMIN && file.user.id !== user.id) {
			throw new ForbiddenException('you dont have access to this file');
		}
		
		return file
	}
	
	async getAll(page: number = 1, pageSize: number = 10) {
		const skip = (page - 1) * pageSize;
		
		const [data, total] = await this.fileRepository.findAndCount({
			skip,
			take: pageSize,
		});
		
		const totalPages = Math.ceil(total / pageSize);
		
		const response: PaginatedDataDto<FileInfo> = {
			data,
			page,
			pageSize,
			totalPages,
		}
		
		return response;
	}
	
	async getUserFiles(userId: number, page: number = 1, pageSize: number = 10) {
		const skip = (page - 1) * pageSize;
		
		const [data, total] = await this.fileRepository.findAndCount({
			where: {user: {id: userId}},
			skip,
			take: pageSize
		});
		
		
		const totalPages = Math.ceil(total / pageSize);
		
		const response: PaginatedDataDto<FileInfo> = {
			data,
			page,
			pageSize,
			totalPages,
		}
		
		return response;
	}
	
	async deleteFile(id: number, user: User): Promise<void> {
		const file = await this.fileRepository.findOne({
			where: { id },
			relations: ['user'], // Ensure "user" relation is loaded
		});
		
		if (!file) {
			throw new NotFoundException(`File with id ${id} not found`);
		}
		
		// Authorization check
		if (user.role !== UserRole.ADMIN && file.user.id !== user.id) {
			throw new ForbiddenException('You don’t have access to this file');
		}
		
		try {
			// delete file
			await fs.unlink(file.path);
		} catch (error) {
			// handle file not found
			if (error.code !== 'ENOENT') {
				console.error(error);
				throw new BadRequestException(`unable to delete file with id ${id}`);
			}
		}
		
		// delete from db
		await this.fileRepository.remove(file);
	}

}
