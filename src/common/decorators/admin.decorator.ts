import { SetMetadata } from "@nestjs/common";
import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiForbiddenResponse } from "@nestjs/swagger";

export const ADMIN_ONLY_KEY = 'AdminOnly';
const AdminOnlyMeta = () => SetMetadata(ADMIN_ONLY_KEY, true);


export function AdminOnly(summery = "", description = 'Requires ADMIN role') {
	return applyDecorators(
		AdminOnlyMeta(),
		ApiOperation({
			summary: `${summery} (Admin only endpoint)`,
			description
		}),
		ApiForbiddenResponse({
			description: 'Forbidden - Administrator access required'
		})
	);
}