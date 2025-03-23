// import { DataSource } from 'typeorm';
// import { config } from 'dotenv';
// import { ChildBalance } from 'src/modules/child-balance/entities/child-balance.entity';

// config();

// const dataSource = new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT!, 10),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   schema: 'finance',
//   ssl: { rejectUnauthorized: false },
//   entities: [ChildBalance],
// });

// async function seed() {
//   await dataSource.initialize();
//   const balanceRepo = dataSource.getRepository(ChildBalance);

//   const balances = [
//     {
//       child_id: '53f1328e-514c-4ab9-91a5-c92903887876',
//       balance_amount: 200,
//     },
//     {
//       child_id: '5a4b95c0-3eed-4699-87f5-69f57a231340',
//       balance_amount: 150,
//     },
//     {
//       child_id: 'ac0d5b82-88cd-4d87-bdd6-3503602f6d81',
//       balance_amount: 600,
//     },
//   ];

//   for (const bal of balances) {
//     await balanceRepo.save(bal);
//   }

//   console.log('✅ Balances seeded successfully!');
//   process.exit(0);
// }

// seed().catch((err) => {
//   console.error('Error seeding balances:', err);
//   process.exit(1);
// });
