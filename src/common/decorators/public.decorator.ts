import { applyDecorators, SetMetadata } from "@nestjs/common";
import { ApiSecurity } from "@nestjs/swagger";

export const IS_PUBLIC_KEY = 'isPublic';
const PublicMeta = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Public = () => {
	return applyDecorators(
		PublicMeta(),
		ApiSecurity(''),
	);
};