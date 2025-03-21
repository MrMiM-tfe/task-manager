import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { FileInfo } from "../../file/entities/file-info.entity";

@Entity()
export class Task {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;
	
	@ApiProperty({
		example: "go for shop"
	})
	@IsString()
	@MaxLength(255)
	@Column()
	name: string;
	
	@ApiProperty()
	@IsString()
	@Column({
		type: 'text'
	})
	description: string;
	
	@ApiProperty({
		required: false,
		type: [Number]
	})
	@IsNumber()
	@IsOptional()
	attachmentIds?: number[];
	
	@ManyToMany(() => FileInfo)
	@JoinTable()
	attachment?: FileInfo[];

	@ManyToOne(() => User, (user) => user.tasks ,{ onDelete: "CASCADE" })
	user: User;
	
	@ApiProperty()
	@CreateDateColumn({ type: "timestamp" })
	createdAt?: Date;
	
	@ApiProperty()
	@UpdateDateColumn({ type: "timestamp" })
	updatedAt?: Date;
}