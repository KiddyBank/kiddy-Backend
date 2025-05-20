import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { FamilyService } from 'src/modules/family/family.service';
import { UserRole } from 'src/modules/users/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { RegisterParentDto } from './dto/register-parent.dto';

import { randomBytes } from 'crypto';
import { ChildBalanceService } from 'src/modules/child-balance/child-balance.service';
import { UsersStatsService } from '../users-stats/users-stats.service';

function generateRandomPassword(length = 10): string {
  return randomBytes(length)
    .toString('base64')
    .slice(0, length)
    .replace(/\W/g, 'A');
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly familyService: FamilyService,
    private readonly childBalanceService: ChildBalanceService,
    private readonly userStatService: UsersStatsService
  ) { }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    console.log('User found:', user);
    console.log('Password provided:', bcrypt.hashSync(pass, 10));

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password_hash);
      if (isMatch) {
        console.log('Password is correct');
        const { password_hash, ...result } = user;
        return result;
      } else {
        console.log('Incorrect password');
      }
    } else {
      console.log('User not found');
    }

    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    console.log('User validated:', user);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.user_id, role: user.user_role };

    console.log('Login payload:', payload);


    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),  // short-lived
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' })   // long-lived
    };
  }


  async registerParent(dto: RegisterParentDto) {
    const family = await this.familyService.create({ name: dto.lastName });

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const parentData = {
      username: dto.username,
      email: dto.email,
      password_hash: hashedPassword,
      dob: dto.dateOfBirth,
      gender: dto.gender,
      user_role: UserRole.PARENT,
      family_id: family.id
    };

    await this.usersService.createUser(parentData);

    if (dto.children && Array.isArray(dto.children)) {
      for (const child of dto.children) {

        const generatedRandomPassword = generateRandomPassword();
        const hashedChildPassword = await bcrypt.hash(generatedRandomPassword, 10);

        const childData = {
          username: child.username,
          email: child.email,
          password_hash: hashedChildPassword,
          dob: child.dateOfBirth,
          gender: child.gender,
          user_role: UserRole.CHILD,
          family_id: family.id
        };

        const createdChild = await this.usersService.createUser(childData);

        await this.userStatService.createForUser(createdChild.user_id);
        await this.childBalanceService.create({ child_id: createdChild.user_id });
      }
    }
  }

}
