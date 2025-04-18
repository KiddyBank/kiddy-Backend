export class CreateStandingOrderDto {
    balanceId: number; // ✅ ולא childId
    amount: number;
    daysFrequency: number;
    startDate: string;
  }
  