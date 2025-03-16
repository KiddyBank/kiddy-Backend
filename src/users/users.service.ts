import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { userId: '12345', username: 'user1', balance: 1000 },
    { userId: '67890', username: 'user2', balance: 500 },
  ];

  getBalance(userId: string) {
    const user = this.users.find(u => u.userId === userId);
    if (!user) {
      return { balance: 0 };
    }
    return { balance: user.balance };
  }
}
