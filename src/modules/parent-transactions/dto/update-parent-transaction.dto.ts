import { PartialType } from '@nestjs/mapped-types';
import { CreateParentTransactionDto } from './create-parent-transaction.dto';

export class UpdateParentTransactionDto extends PartialType(
  CreateParentTransactionDto,
) {}
