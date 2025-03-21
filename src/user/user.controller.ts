import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Req } from "@nestjs/common";
import { AdminOnly } from "../common/decorators/admin.decorator";
import { UserService } from "./user.service";
import { UpdateUserDto, UpdateUserRestrictedDto } from "./dto/update.dto";
import { Request } from "express";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { User } from "./entities/user.entity";

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}
	
	@ApiOperation({ summary: "Update user" })
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: User
	})
	@Patch()
	async updateRestricted(@Req() req: Request, @Body() dto: UpdateUserRestrictedDto) {
		return await this.userService.updateRestricted(req.user, dto)
	}
	
	@ApiResponse({
		status: HttpStatus.OK,
		type: [User]
	})
	@AdminOnly("get all users")
	@Get()
	async getAllUsers(){
		return await this.userService.getAll()
	}
	
	@ApiResponse({
		status: HttpStatus.OK,
		type: User
	})
	@AdminOnly("get single user")
	@Get('/:id')
	async getOne(@Param("id") id: number) {
		return await this.userService.getById(id)
	}
	
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: User
	})
	@AdminOnly("update user")
	@Patch('/:id')
	async updateOne(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
		return await this.userService.update(id, updateUserDto)
	}
	
	@ApiResponse({
		status: HttpStatus.OK,
		type: User
	})
	@AdminOnly("delete user")
	@Delete('/:id')
	async deleteOne(@Param("id") id: number) {
		return await this.userService.delete(id)
	}
	
}
