import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}
 
   @Post('login')
   login(@Body() body: { email: string; password: string }) {
     console.log('Login attempt:', body); 
     return this.authService.login(body.email, body.password);
   }
 
   @Post('register-parent')
   registerParent(@Body() body: any) {
     return this.authService.registerParent(body);
   }
 
   @Post('refresh')
   refresh(@Body() body: { refresh_token: string }) {
     try {
       const payload = this.jwtService.verify(body.refresh_token, {
         secret: process.env.JWT_SECRET || 'defaultSecret',
       });
 
       // Re-issue short-lived access token
       const access_token = this.jwtService.sign({
         sub: payload.sub,
         role: payload.role,
       }, { expiresIn: '15m' });
 
       return { access_token };
     } catch (err) {
       throw new UnauthorizedException('Invalid refresh token');
     }
 }
}
