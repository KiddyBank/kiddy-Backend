import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersStatDto } from './create-users-stat.dto';

export class UpdateUsersStatDto extends PartialType(CreateUsersStatDto) {}
