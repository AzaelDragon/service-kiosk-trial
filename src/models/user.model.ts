import {
  registerEnumType,
  Field,
  Int,
  HideField,
  ObjectType,
} from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Ticket } from './ticket.model';

export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  TECHNICIAN = 'TECHNICIAN',
}

registerEnumType(UserRole, {
  name: 'User Role',
  description: "Determines the kind of user and it's privileges.",
});

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field((type) => Int)
  document: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @HideField()
  @Exclude()
  password: string;

  @Field()
  role: UserRole;

  @Field((type) => [Ticket], { nullable: true })
  clientTickets: Ticket[];

  @Field((type) => [Ticket], { nullable: true })
  technicianTickets: Ticket[];
}
