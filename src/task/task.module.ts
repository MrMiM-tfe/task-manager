import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { FileModule } from "../file/file.module";

@Module({
  imports: [TypeOrmModule.forFeature([Task]), FileModule],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
