import { ApiProperty } from "@nestjs/swagger";
import { Task } from "../../task/entities/task.entity";
import { User } from "../../user/entities/user.entity";
import { FileInfo } from "../../file/entities/file-info.entity";

export class PaginatedDataDto<T> {
	@ApiProperty({ type: 'array', isArray: true })
	data: T[];
	
	@ApiProperty()
	pageSize: number;
	
	@ApiProperty()
	totalPages: number;
	
	@ApiProperty()
	page: number;
}

export class PaginatedTaskDto extends PaginatedDataDto<Task> {
	@ApiProperty({ type: [Task] })
	data: Task[];
}

export class PaginatedUserDto extends PaginatedDataDto<User> {
	@ApiProperty({ type: [User] })
	data: User[];
}

export class PaginatedFileDto extends PaginatedDataDto<FileInfo> {
	@ApiProperty({ type: [FileInfo] })
	data: FileInfo[];
}