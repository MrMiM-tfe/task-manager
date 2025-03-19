import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

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
	})
	@IsString()
	@IsOptional()
	@Column({nullable: true})
	attachment?: string;
	
	// @ApiProperty({
	// 	type: () => User,
	// 	required: false,
	// })
	@ManyToOne(() => User, (user) => user.tasks ,{ onDelete: "CASCADE" })
	user: User;
}