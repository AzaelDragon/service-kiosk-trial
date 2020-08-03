import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class SignupInput {
  @Field((type) => Int)
  document: number;

  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
