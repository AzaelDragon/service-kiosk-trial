import { InputType, Field, Int } from '@nestjs/graphql';
import { TicketType } from '../ticket.model';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTicketInput {

    @Field(type => Int)
    @IsNotEmpty()
    client: number
    
    @Field()
    @IsNotEmpty()
    type: TicketType

}   