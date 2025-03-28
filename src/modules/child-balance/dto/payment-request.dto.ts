import { IsNotEmpty, IsOptional } from 'class-validator';

export class PaymentRequestDto {
    @IsNotEmpty()
    amount: number;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    balance_id: number; 

    @IsOptional()
    type: string = 'request_for_payment'; 

    @IsOptional()
    status: string = 'PENDING_PARRENT_APPROVAL'; 
}
