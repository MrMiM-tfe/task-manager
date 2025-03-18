import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private jwtService: JwtService,
	) {}
	
	async login(dto: LoginDto) {
		const user = await this.userService.getByUsername(dto.username, true);
		if (!user) {
			throw new UnauthorizedException();
		}
		
		const passCheck = await bcrypt.compare(dto.password, user.password);
		if (!passCheck) {
			throw new UnauthorizedException();
		}
		
		const payload = {
			sub: user.id,
			username: user.username,
		};
		
		const access_token = this.jwtService.sign(payload);
		
		return { access_token };
	}
	
	async register(dto: RegisterDto) {
		dto.password = await bcrypt.hash(dto.password, 10);
		
		const user = await this.userService.create(dto);
		
		const payload = {
			sub: user.id,
			username: user.username,
		};
		
		const access_token = this.jwtService.sign(payload);
		
		return { access_token };
	}
}
