import { ModelInterceptorContract } from 'cast-response';
import { UserProfile } from '@/models/features/user-profile/user-profile';
import { toDateOnly, toDateTime } from '@/utils/general-helper';

export class UserProfileInterceptor implements ModelInterceptorContract<UserProfile> {
  receive(model: UserProfile): UserProfile {
    model['joinDate'] = toDateTime(model['joinDate']);
    return model;
  }

  send(model: Partial<UserProfile>): Partial<UserProfile> {
    delete model['fullName'];
    delete model['city'];
    delete model['region'];
    delete model['department'];
    delete model['jobTitle'];
    delete model['roleKeys'];
    delete model['isActive'];
    delete model['nationalId'];
    delete model['joinDate'];
    // only keep email and phone number
    return model;
  }
}
