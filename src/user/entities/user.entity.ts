import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	OneToOne,
	JoinColumn,
	CreateDateColumn,
	UpdateDateColumn
} from "typeorm";
import {
	IsEmail,
	IsEnum,
	IsNumber,
	IsOptional,
	IsPhoneNumber,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from "class-validator";
import { Task } from "../../task/entities/task.entity";
import { ApiProperty } from "@nestjs/swagger";
import { FileInfo } from "../../file/entities/file-info.entity";

export enum UserRole {
	ADMIN = 'admin',
	USER = 'user',
}

@Entity()
export class User {
	@ApiProperty()
	@PrimaryGeneratedColumn({})
	id: number;

	@ApiProperty({
		example: 'mahdi',
		minimum: 5,
		maximum: 255,
		uniqueItems: true,
	})
	@IsString()
	@MinLength(5)
	@MaxLength(255)
	@Column({unique: true})
	username: string;
	
	@ApiProperty({
		example: 'Mahdi',
		minimum: 5,
		maximum: 255,
	})
	@IsString()
	@MinLength(5)
	@MaxLength(255)
	@Column()
	firstName: string;
	
	@ApiProperty({
		example: 'Khakbaz',
		minimum: 5,
		maximum: 255,
	})
	@IsString()
	@MinLength(5)
	@MaxLength(255)
	@Column()
	lastName: string;
	
	@ApiProperty({
		example: 'mahdi@gmail.com',
		uniqueItems: true,
	})
	@IsEmail()
	@Column({unique: true})
	email: string;
	
	@ApiProperty({
		example: '+989120000000',
		uniqueItems: true,
	})
	@IsPhoneNumber()
	@Column({unique: true})
	phone: string;
	
	@ApiProperty({
		required: false,
		type: "number"
	})
	@IsNumber()
	@IsOptional()
	profileImgId?: number;
	
	@OneToOne(() => FileInfo, {nullable: true})
	@JoinColumn()
	profileImg?: FileInfo;
	
	@ApiProperty({
		example: 'Mahdi1234',
		description: "must contain uppercase and lowercase letter and at least 8 characters",
	})
	@Column({select: false})
	@IsString()
	@MinLength(8)
	@Matches(/(?=.*[a-z])(?=.*[A-Z])/, {
		message: 'Password must contain at least one uppercase and one lowercase letter'
	})
	password: string;
	
	@ApiProperty({
		enum: UserRole,
	})
	@IsEnum(UserRole)
	@Column({
		type: 'enum',
		enum: UserRole,
		default: UserRole.USER,
	})
	role: UserRole;
	
	@OneToMany(() => Task, (task) => task.user)
	tasks: Task[];
	
	@OneToMany(() => FileInfo, (fileInfo) => fileInfo.user)
	files: FileInfo[]
	
	@ApiProperty()
	@CreateDateColumn({ type: "timestamp" })
	createdAt?: Date;
	
	@ApiProperty()
	@UpdateDateColumn({ type: "timestamp" })
	updatedAt?: Date;
}