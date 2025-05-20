import { PartialType } from '@nestjs/mapped-types';
import { CreateChallengeInstanceDto } from './create-challenge-instance.dto';

export class UpdateChallengeInstanceDto extends PartialType(CreateChallengeInstanceDto) {}
