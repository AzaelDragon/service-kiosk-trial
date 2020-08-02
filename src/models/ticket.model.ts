import { Field, Int, ObjectType, registerEnumType, } from "@nestjs/graphql";
import { User } from "./user.model";

export enum TicketType {
    MAINTENANCE = 'MAINTENANCE',
    INSTALLATION = 'INSTALLATION',
    WARRANTY = 'WARRANTY'
}
  
registerEnumType(TicketType, {
    name: 'Ticket Type',
    description: 'Determines the kind of service to be performed on a ticket.',
});

export enum TicketStatus {
    ASSIGNED = 'ASSIGNED',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED'
}
  
registerEnumType(TicketStatus, {
    name: 'Ticket Status',
    description: 'Determines current status of the service being performed on a ticket.',
});

@ObjectType()
export class Ticket {
    @Field()
    id: string;

    @Field()
    date: Date;

    @Field()
    updatedAt: Date;

    @Field()
    client: User;

    @Field()
    technician: User;

    @Field(type => Int, { nullable: true })
    rating: number;

    @Field({ nullable: true })
    ratingExtra: string;

    @Field()    
    status: TicketStatus;

    @Field()
    type: TicketType;
} 