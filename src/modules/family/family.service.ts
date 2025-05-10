import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Family } from './entities/family.entity';

@Injectable()
export class FamilyService {

  constructor(
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,

    ) {}


  async create(createFamilyDto: CreateFamilyDto) {
    console.log('createFamilyDto', createFamilyDto);
    const family = this.familyRepository.create(createFamilyDto);
    return await this.familyRepository.save(family);

  }

  findAll() {
    return `This action returns all family`;
  }

  findOne(id: number) {
    return `This action returns a #${id} family`;
  }

  update(id: number, updateFamilyDto: UpdateFamilyDto) {
    return `This action updates a #${id} family`;
  }

  remove(id: number) {
    return `This action removes a #${id} family`;
  }
}
