import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
	@ApiProperty({
		example: 'mahdi',
	})
	@IsString()
	username: string;
	
	@ApiProperty({
		example: 'Mahdi1234',
	})
	@IsString()
	password: string;
}