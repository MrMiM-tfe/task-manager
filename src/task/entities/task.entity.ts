import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Task {
	@ApiProperty()
	@PrimaryGeneratedColumn()
	id: number;
	
	@ApiProperty({
		example: "go for shop"
	})
	@Column()
	name: string;
	
	@ApiProperty()
	@Column({
		type: 'text'
	})
	description: string;
	
	@ApiProperty({
		required: false,
	})
	@Column({nullable: true})
	attachment: string;
	
	@ApiProperty({
		type: () => User,
		required: false,
	})
	@ManyToOne(() => User, (user) => user.tasks ,{ onDelete: "CASCADE" })
	user: User;
}