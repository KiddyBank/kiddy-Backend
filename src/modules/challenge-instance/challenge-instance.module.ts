import { Module } from '@nestjs/common';
import { ChallengeInstanceService } from './challenge-instance.service';
import { ChallengeInstanceController } from './challenge-instance.controller';

@Module({
  controllers: [ChallengeInstanceController],
  providers: [ChallengeInstanceService],
})
export class ChallengeInstanceModule {}
