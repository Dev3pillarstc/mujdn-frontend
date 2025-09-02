import { BlacklistedNationalId } from '@/models/features/visit/blacklisted-national-id';
import { ModelInterceptorContract } from 'cast-response';

export class BlacklistedNationalIdInterceptor
  implements ModelInterceptorContract<BlacklistedNationalId>
{
  receive(model: BlacklistedNationalId): BlacklistedNationalId {
    // Here you can modify the model after receiving it from the server
    return model;
  }

  send(model: Partial<BlacklistedNationalId>): Partial<BlacklistedNationalId> {
    return model;
  }
}
