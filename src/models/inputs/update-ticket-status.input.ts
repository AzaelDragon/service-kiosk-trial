import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { TicketStatus } from '@prisma/client';

@InputType()
export class UpdateTicketStatusInput {
  @Field()
  @IsNotEmpty()
  ticketId: string;

  @Field()
  @IsNotEmpty()
  status: TicketStatus;
}
