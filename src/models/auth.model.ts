import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.model';
import { Token } from './token.model';

@ObjectType()
export class Auth extends Token {
  @Field((type) => User)
  user: User;
}
