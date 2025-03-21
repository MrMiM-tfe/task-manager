import { OmitType, PartialType } from "@nestjs/swagger";
import { Task } from "../entities/task.entity";

export class EditTaskDto extends PartialType(OmitType(Task, ['user', 'id'])) {}