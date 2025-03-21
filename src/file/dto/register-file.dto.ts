import { FileInfo } from "../entities/file-info.entity";
import { OmitType } from "@nestjs/swagger";

export class ResetFileDto extends OmitType(FileInfo, ['id']){}