import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task } from './task.entity';
import { User, UserRole } from 'src/modules/users/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createTaskDto: CreateTaskDto, parentUser: User) {
    const { child_ids, ...taskFields } = createTaskDto;

    // אימות שהמשתמש הוא הורה
    if (parentUser.user_role !== UserRole.PARENT) {
      throw new UnauthorizedException('Only parents can create tasks');
    }

    // שליפת הילדים לפי ה-family_id של ההורה
    const children = await this.userRepo.find({
      where: {
        user_id: In(child_ids),
        user_role: UserRole.CHILD,
        family_id: parentUser.family_id,
      },
    });

    if (children.length !== child_ids.length) {
      throw new BadRequestException('One or more children are invalid or not in your family');
    }

    const task = this.taskRepo.create({
      ...taskFields,
      child_ids,
      author_parent: parentUser,
    });

    return this.taskRepo.save(task);
  }

  async findAll() {
    return this.taskRepo.find();
  }

  async findOne(id: string) {
    const task = await this.taskRepo.findOneBy({ task_id: id });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async remove(id: string) {
    await this.taskRepo.delete({ task_id: id });
    return { message: 'Task removed' };
  }
}
