import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileInfo } from "./entities/file-info.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FileInfo])],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
