import { User } from "../entities/user.entity";
import { OmitType, PartialType } from "@nestjs/swagger";

export class UpdateUserDto extends PartialType(OmitType(User, ['id', 'createdAt', 'updatedAt'])) {}
export class UpdateUserRestrictedDto extends PartialType(OmitType(User, ['id', 'role', 'username', 'updatedAt', 'createdAt'])) {}