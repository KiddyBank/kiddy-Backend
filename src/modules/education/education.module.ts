import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationService } from './education.service';
import { UserEducationalAction } from './entities/user-educational-action.entity';
import { EducationalContentTemplate } from './entities/educational-content-template.entity';
import { EducationController } from './education.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEducationalAction, EducationalContentTemplate])],
  providers: [EducationService],
  controllers: [EducationController],
  exports: [EducationService],
})
export class EducationModule { }
