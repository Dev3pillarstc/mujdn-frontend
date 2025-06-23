import { ModelInterceptorContract } from 'cast-response';
import { User } from '@/models/auth/user';

export class UserInterceptor implements ModelInterceptorContract<User> {
  receive(model: User): User {
    model['joinDate'] = new Date(model['joinDate']?.toString() ?? '');
    return model;
  }

  send(model: Partial<User>): Partial<User> {
    delete model['city'];
    delete model['region'];
    delete model['department'];
    model['fkDepartmentId'] = 1;
    return model;
  }
}
