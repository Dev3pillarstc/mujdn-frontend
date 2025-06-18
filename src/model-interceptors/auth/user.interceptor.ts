import { ModelInterceptorContract } from 'cast-response';
import { User } from '@/models/auth/user';

export class UserInterceptor implements ModelInterceptorContract<User> {
  receive(model: User): User {
    return model;
  }

  send(model: Partial<User>): Partial<User> {
    return model;
  }
}
