import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TypeOrmExceptionFilter } from "./common/filters/typeorm-exception.filter";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	
	const config = new DocumentBuilder()
		.setTitle('Task Manager')
		.setDescription('The Task Manager API documentation')
		.setVersion('1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				name: 'JWT',
				description: 'Enter JWT token',
				in: 'header',
			},
			'JWT-auth',
		)
		.addSecurityRequirements('JWT-auth')
		.build();
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('doc', app, documentFactory, {
		jsonDocumentUrl: 'doc/json'
	});
	
	app.useGlobalFilters(new TypeOrmExceptionFilter())
	app.useGlobalPipes(new ValidationPipe());
	
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
