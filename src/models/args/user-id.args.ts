import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class UserIdArgs {
  @Field((type) => Int)
  @IsNotEmpty()
  userId: number;
}
