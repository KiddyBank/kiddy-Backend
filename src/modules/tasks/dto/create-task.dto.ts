export class CreateTaskDto {
    name: string;
    description?: string;
    payment_amount: number;
    monthly_limit: number;
    balance_id?: number;
    task_status?: string;
    child_ids: string[];
  }
  