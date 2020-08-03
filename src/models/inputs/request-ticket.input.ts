import { InputType, Field, Int } from '@nestjs/graphql';
import { TicketType } from '../ticket.model';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class RequestTicketInput {
  @Field()
  @IsNotEmpty()
  type: TicketType;
}
