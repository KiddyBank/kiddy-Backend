import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);


    if (user ) {
      console.log('correct password:', user.password_hash);
      const { password_hash, ...result } = user;
      return result;
    }
    console.log('incorrect password:', pass);
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
  

  async registerParent(dto: any) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.usersService.createParent({ ...dto, password: hashedPassword });
  }
}
