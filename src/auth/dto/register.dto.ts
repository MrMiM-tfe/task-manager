import { OmitType } from '@nestjs/swagger';
import { User } from "../../user/entities/user.entity";

export class RegisterDto extends OmitType(User, ["role", "profileImg", 'id', 'tasks', 'createdAt', 'updatedAt']) {}