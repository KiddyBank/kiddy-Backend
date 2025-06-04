import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const parentUser = req.user; // נשלף מתוך ה־JWT
    return this.tasksService.create(createTaskDto, parentUser);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('by-parent')
  getTasksByParent(@Request() req) {
    return this.tasksService.findByParent(req.user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('by-child')
  getTasksByChild(@Request() req) {
    return this.tasksService.findByChild(req.user.sub);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
