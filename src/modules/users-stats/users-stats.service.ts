import { Injectable } from '@nestjs/common';
import { CreateUsersStatDto } from './dto/create-users-stat.dto';
import { UpdateUsersStatDto } from './dto/update-users-stat.dto';

@Injectable()
export class UsersStatsService {
  create(createUsersStatDto: CreateUsersStatDto) {
    return 'This action adds a new usersStat';
  }

  findAll() {
    return `This action returns all usersStats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usersStat`;
  }

  update(id: number, updateUsersStatDto: UpdateUsersStatDto) {
    return `This action updates a #${id} usersStat`;
  }

  remove(id: number) {
    return `This action removes a #${id} usersStat`;
  }
}
