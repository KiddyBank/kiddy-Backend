import { Controller } from '@nestjs/common';
import { LevelService } from './levels.service';

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelService) { }


}
