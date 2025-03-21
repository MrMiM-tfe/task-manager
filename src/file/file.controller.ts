import {
	Controller, FileTypeValidator, Get, HttpStatus,
	MaxFileSizeValidator, Param,
	ParseFilePipe,
	Post, Req, Res,
	UploadedFile,
	UseInterceptors
} from "@nestjs/common";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "./multer.config";
import { Request, Response } from "express";
import { FileInfo } from "./entities/file-info.entity";
import { AdminOnly } from "../common/decorators/admin.decorator";
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('file')
export class FileController {
	constructor(private readonly fileService: FileService) {}
	
	@ApiOperation({
		summary: "Get user files"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: [FileInfo]
	})
	@Get()
	async getUserFiles(@Req() req: Request): Promise<FileInfo[]> {
		return await this.fileService.getUserFiles(req.user.id)
	}
	
	@ApiResponse({
		status: HttpStatus.OK,
		type: [FileInfo]
	})
	@AdminOnly('get all files')
	@Get('/admin')
	async getAllFiles(): Promise<FileInfo[]> {
		return await this.fileService.getAll()
	}
	
	@ApiOperation({
		summary: "Get single file"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		type: FileInfo
	})
	@Get("/:id")
	async getFile(@Param("id") id: number, @Req() req: Request): Promise<FileInfo> {
		return await this.fileService.getFile(id, req.user)
	}
	
	@ApiOperation({
		summary: "Download file"
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'File downloaded successfully',
		content: {
			'application/octet-stream': {
				schema: { type: 'string', format: 'binary' },
			},
		},
	})
	@Get("/:id/download")
	async downloadFile(
		@Param('id') id: number,
		@Req() req: Request,
		@Res() res: Response,
	) {
		const file = await this.fileService.getFile(id, req.user)
		res.download(file.path, file.originalName);
	}
	
	@ApiOperation({
		summary: "Update file for profile",
		description: "File will be public"
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: FileInfo
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'File upload',
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@Post('profile')
	@UseInterceptors(FileInterceptor('file', multerOptions))
	async uploadProfile(@UploadedFile(
		new ParseFilePipe({
			validators: [
				new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
				new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
			]
		})
	) file: Express.Multer.File, @Req() req: Request) {
		return await this.fileService.register({
			filename: file.filename,
			originalName: file.originalname,
			isPublic: true,
			path: file.path,
			user: req.user
		})
	}
	
	@ApiOperation({
		summary: "Update file for attachment",
		description: "File will be private"
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		type: FileInfo
	})
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		description: 'File upload',
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@Post('attachment')
	@UseInterceptors(FileInterceptor('file', multerOptions))
	async uploadAttachment(@UploadedFile(
		new ParseFilePipe({
			validators: [
				new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
				new FileTypeValidator({ fileType: /(jpg|jpeg|png|pdf|txt)$/ }),
			]
		})
	) file: Express.Multer.File, @Req() req: Request) {
		return await this.fileService.register({
			filename: file.filename,
			originalName: file.originalname,
			isPublic: false,
			path: file.path,
			user: req.user
		})
	}
	
}
