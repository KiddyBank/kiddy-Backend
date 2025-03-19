import 'dotenv/config';
import { DataSource, DeepPartial } from 'typeorm';
import { User } from '../modules/users/user.entity';
import { join } from 'path';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    schema: 'auth',
    ssl: { rejectUnauthorized: false }, 
    synchronize: false, 
    entities: [User],
  });

async function seed() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);

  const users: DeepPartial<User>[] = [
    {
      username: 'Parent1',
      email: 'parent1@mail.com',
      password_hash: '1234',
      user_role: 'parent',
      family_id: 1,
      dob: '1980-01-01',
      gender: 'male',
      avatar_path: '/avatars/avatar-dad.png',
    },
    {
      username: 'Child1',
      email: 'child1@mail.com',
      password_hash: '1234',
      user_role: 'child',
      family_id: 1,
      dob: '2010-06-15',
      gender: 'female',
      avatar_path: '/avatars/avatar-girl.png',
    },
    {
      username: 'Parent2',
      email: 'parent2@mail.com',
      password_hash: '1234',
      user_role: 'parent',
      family_id: 2,
      dob: '1982-03-10',
      gender: 'female',
      avatar_path: '/avatars/avatar-mom.png',
    },
    {
      username: 'Child2',
      email: 'child2@mail.com',
      password_hash: '1234',
      user_role: 'child',
      family_id: 2,
      dob: '2008-11-22',
      gender: 'male',
      avatar_path: '/avatars/avatar-boy.png',
    },
    {
      username: 'Child3',
      email: 'child3@mail.com',
      password_hash: '1234',
      user_role: 'child',
      family_id: 2,
      dob: '2012-05-05',
      gender: 'female',
      avatar_path: '/avatars/avatar-girl.png',
    },
  ];

  for (const u of users) {
    await userRepo.save(userRepo.create(u));
  }

  console.log('✅ Seeded successfully!');
  process.exit(0);
}

seed();
