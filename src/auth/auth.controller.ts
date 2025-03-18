import { Body, Controller, Get, HttpStatus, Post, Req } from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { Public } from "../common/decorators/public.decorator";
import { RegisterDto } from "./dto/register.dto";
import { Request } from "express";
import { ApiResponse } from "@nestjs/swagger";
import { TokenDto } from "./dto/response.dto";
import { User } from "../user/entities/user.entity";

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}
	
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: TokenDto,
	})
	@Public()
	@Post("login")
	async login(@Body() loginDto: LoginDto) {
		return await this.authService.login(loginDto);
	}
	
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: TokenDto,
	})
	@Public()
	@Post("register")
	async register(@Body() registerDto: RegisterDto) {
		return await this.authService.register(registerDto);
	}
	
	@ApiResponse({
		status: HttpStatus.OK,
		type: User
	})
	@Get('profile')
	async profile(@Req() req: Request) {
		return req.user;
	}
	
}
