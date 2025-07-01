import { Transaction, TransactionType, TransactionStatus } from 'src/modules/transactions/entities/transaction.entity';
import { SavingsGoalsTransaction } from 'src/modules/savings-goals/entities/savings-goals-transaction.entity';


export class CreateSavingsGoalDto {
  name: string;
  targetAmount: number;
  initialAmount: number;
  category?: string;
  dueDate?: Date;
}
