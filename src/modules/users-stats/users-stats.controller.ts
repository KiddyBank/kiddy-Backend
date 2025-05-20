import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersStatsService } from './users-stats.service';
import { CreateUsersStatDto } from './dto/create-users-stat.dto';
import { UpdateUsersStatDto } from './dto/update-users-stat.dto';

@Controller('users-stats')
export class UsersStatsController {
  constructor(private readonly usersStatsService: UsersStatsService) {}

  @Post()
  create(@Body() createUsersStatDto: CreateUsersStatDto) {
    return this.usersStatsService.create(createUsersStatDto);
  }

  @Get()
  findAll() {
    return this.usersStatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersStatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsersStatDto: UpdateUsersStatDto) {
    return this.usersStatsService.update(+id, updateUsersStatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersStatsService.remove(+id);
  }
}
