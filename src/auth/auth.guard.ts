import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from 'rxjs';
import { Request } from 'express';
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../common/decorators/public.decorator";
import { Payload } from "./types/payload.type";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private reflector: Reflector,
		private userService: UserService,
		private configService: ConfigService,
	) {}
	
	async canActivate( context: ExecutionContext ): Promise<boolean> {
		
		// check if rout is public
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (isPublic) return true;
		
		// get token from request headers
		const request = context.switchToHttp().getRequest<Request>();
		const token = this.extractTokenFromHeader(request);
		if (!token) throw new UnauthorizedException();
		
		try {
			// extract payload
			const payload = await this.jwtService.verifyAsync<Payload>(
				token,
				{
					secret: this.configService.get<string>('JWT_SECRET')
				}
			);
			
			// get user
			const user = await this.userService.getByUsername(payload.username);
			if (!user) throw new UnauthorizedException();
			
			// set user
			request.user = user;
		} catch {
			throw new UnauthorizedException();
		}
		
		return true;
	}
	
	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
