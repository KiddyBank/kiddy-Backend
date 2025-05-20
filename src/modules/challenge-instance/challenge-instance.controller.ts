import { Controller, Get, Param } from '@nestjs/common';
import { ChallengeInstanceService } from './challenge-instance.service';

@Controller('challenge-instance')
export class ChallengeInstanceController {
  constructor(private readonly challengeInstanceService: ChallengeInstanceService) { }

  @Get('evaluate/:userId')
  async EvaluateLevels(@Param('userId') userId: string) {
    return this.challengeInstanceService.evaluateActiveChallenges(userId);
  }

  @Get('active/:userId')
  async getActiveChallenges(@Param('userId') userId: string) {
    return this.challengeInstanceService.getUserChallengesWithLevel(userId);
  }

}
