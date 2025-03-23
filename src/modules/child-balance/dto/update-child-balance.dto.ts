import { PartialType } from '@nestjs/mapped-types';
import { CreateChildBalanceDto } from './create-child-balance.dto';

export class UpdateChildBalanceDto extends PartialType(CreateChildBalanceDto) {}
