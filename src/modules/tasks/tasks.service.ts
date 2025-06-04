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

  async create(createTaskDto: CreateTaskDto, parentUser: {user_id: string , role: string , family_id: number}) {
    const { child_ids, ...taskFields } = createTaskDto;
    // אימות שהמשתמש הוא הורה
    if (parentUser.role !== UserRole.PARENT) {
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

  async findByParent(parentId: string): Promise<Task[]> {
    return this.taskRepo.find({
      where: {
        author_parent: { user_id: parentId },
      },
      order: { created_at: 'DESC' },
    });
  }


  async findByChild(childId: string): Promise<Task[]> {
    return this.taskRepo
      .createQueryBuilder('task')
      .where(':childId = ANY(task.child_ids)', { childId })
      .orderBy('task.created_at', 'DESC')
      .getMany();
  }

  async remove(id: string) {
    await this.taskRepo.delete({ task_id: id });
    return { message: 'Task removed' };
  }
}
