import { Field, Int, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class RateTicketInput {
  @Field()
  @IsNotEmpty()
  ticketId: string;

  @Field((type) => Int)
  @IsNotEmpty()
  rating: number;

  @Field({ nullable: true })
  ratingExtra: string;
}
