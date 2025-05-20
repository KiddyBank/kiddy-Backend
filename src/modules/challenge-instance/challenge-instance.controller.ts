import { Controller, Post } from '@nestjs/common';
import { ChallengeInstanceService } from './challenge-instance.service';

@Controller('challenge-instance')
export class ChallengeInstanceController {
  constructor(private readonly challengeInstanceService: ChallengeInstanceService) { }

  @Post('evaluate')
  async evaluateAllChallenges(): Promise<void> {
    return this.challengeInstanceService.evaluateActiveChallenges();
  }

}
