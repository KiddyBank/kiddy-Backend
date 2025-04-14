import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
  
    const payload = { sub: user.user_id, role: user.role };
  
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),  // short-lived
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' })   // long-lived
    };
  }
  

  async registerParent(dto: any) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.usersService.createParent({ ...dto, password: hashedPassword });
  }
}
