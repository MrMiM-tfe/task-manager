import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto, UpdateUserRestrictedDto } from "./dto/update.dto";
import * as bcrypt from 'bcrypt';
import { FileService } from "../file/file.service";
import { PaginatedDataDto } from "../common/dto/paginated-data.dto";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly fileService: FileService,
	) {}

	async create(
		user: Omit<User, 'id' | 'role' | 'profileImg' | 'tasks'>,
	): Promise<User> {
		return await this.userRepository.save(user);
	}

	async getByUsername(
		username: string,
		includePass?: boolean,
	): Promise<User> {
		const query = this.userRepository
			.createQueryBuilder('user')
			.where('user.username = :username', { username });

		if (includePass) {
			query.addSelect('user.password');
		}

		return await query.getOne();
	}

	async getById(id: number): Promise<User> {
		return await this.userRepository.findOneBy({ id });
	}

	async getAll(page: number = 1, pageSize: number = 10) {
		const skip = (page - 1) * pageSize;
		
		const [data, total] = await this.userRepository.findAndCount({
			skip,
			take: pageSize,
		});
		
		const totalPages = Math.ceil(total / pageSize);
		
		const response: PaginatedDataDto<User> = {
			data,
			page,
			pageSize,
			totalPages,
		}
		
		return response;
	}
	
	async update(id: number, dto: UpdateUserDto): Promise<User> {
		await this.validatePasswordChange(dto)
		const user = await this.userRepository.findOneBy({ id });
		if (!user) throw new NotFoundException();
		
		await this.validateProfileImg(dto, user)
		
		const updatedUser = this.userRepository.merge(user, dto);
		return await this.userRepository.save(updatedUser);
	}
	
	async updateRestricted(user: User, dto: UpdateUserRestrictedDto): Promise<User> {
		await this.validateProfileImg(dto, user)
		await this.validatePasswordChange(dto)
		const updatedUser = this.userRepository.merge(user, dto);
		return await this.userRepository.save(updatedUser);
	}
	
	async delete(id: number): Promise<User> {
		const user = await this.userRepository.findOneBy({ id });
		if (!user) throw new NotFoundException();
		await this.userRepository.delete(id);
		return user
	}
	
	private async validatePasswordChange(dto: UpdateUserDto | UpdateUserRestrictedDto) {
		if (dto.password) {
			dto.password = await bcrypt.hash(dto.password, 10)
		}
	}
	
	private async validateProfileImg(dto: UpdateUserRestrictedDto | UpdateUserDto, user: User) {
		if (dto.profileImgId) {
			const file = await this.fileService.getFile(dto.profileImgId, user)
			if (file) {
				dto.profileImg = file
			}
		}
	}
}
