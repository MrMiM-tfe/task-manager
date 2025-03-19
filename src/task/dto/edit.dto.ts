import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { Task } from "../entities/task.entity";
import { IsNumber } from "class-validator";

export class EditTaskDto extends PartialType(OmitType(Task, ['user', 'id'])) {}