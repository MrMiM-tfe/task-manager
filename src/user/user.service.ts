import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
	}
	
	async create(user: Omit<User, 'id' | 'role' | 'profileImg' | 'tasks' >): Promise<User> {
		return await this.userRepository.save(user);
	}
	
	getByUsername(username: string, includePass?: boolean): Promise<User > {
		const query = this.userRepository
			.createQueryBuilder('user')
			.where('user.username = :username', { username });
		
		if (includePass) {
			query.addSelect('user.password')
		}
		
		return query.getOne();
	}
}
