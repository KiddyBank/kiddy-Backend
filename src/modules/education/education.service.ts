import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEducationalAction } from './entities/user-educational-action.entity';
import { EducationalContentTemplate } from './entities/educational-content-template.entity';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(UserEducationalAction)
    private readonly userActionRepo: Repository<UserEducationalAction>,

    @InjectRepository(EducationalContentTemplate)
    private readonly templateRepo: Repository<EducationalContentTemplate>,
  ) { }

  async getContentForFirstAction(userId: string, actionType: string) {
    const already = await this.userActionRepo.findOne({ where: { user_id: userId, action_type: actionType } });

    if (already?.first_action_completed) {
      return null;
    }

    const content = await this.templateRepo.findOne({ where: { action_type: actionType, active: true } });
    return content;
  }

  async handleFirstAction(userId: string, actionType: string) {
    const already = await this.userActionRepo.findOne({ where: { user_id: userId, action_type: actionType } });

    if (already?.first_action_completed) {
      return null;
    }

    await this.userActionRepo.save({
      user_id: userId,
      action_type: actionType,
      first_action_completed: true,
      completed_at: new Date(),
    });

  }
}
