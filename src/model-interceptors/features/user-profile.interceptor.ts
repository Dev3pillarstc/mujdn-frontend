import { ModelInterceptorContract } from 'cast-response';
import { UserProfile } from '@/models/features/user-profile/user-profile';
import { toDateOnly, toDateTime } from '@/utils/general-helper';

export class UserProfileInterceptor implements ModelInterceptorContract<UserProfile> {
  receive(model: UserProfile): UserProfile {
    model['joinDate'] = toDateTime(model['joinDate']);
    return model;
  }

  send(model: Partial<UserProfile>): Partial<UserProfile> {
    delete model['city'];
    delete model['region'];
    delete model['department'];
    return model;
  }
}
