import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/models/user.model';
import { Token } from 'src/models/token.model';

@ObjectType()
export class Auth extends Token {
  @Field((type) => User)
  user: User;
}
