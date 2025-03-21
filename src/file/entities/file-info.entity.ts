import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { IsBoolean, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../user/entities/user.entity";

@Entity()
export class FileInfo {
	@ApiProperty()
	@PrimaryGeneratedColumn({})
	id: number;

	@ApiProperty()
	@Column()
	@IsString()
	filename: string
	
	@ApiProperty()
	@Column()
	@IsString()
	originalName: string
	
	@ApiProperty()
	@Column()
	@IsString()
	path: string
	
	@ApiProperty()
	@Column()
	@IsBoolean()
	isPublic: boolean;
	
	@ApiProperty({
		type: () => User
	})
	@ManyToOne(() => User, (user: User) => user.files)
	user: User;
}