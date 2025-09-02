import { BlacklistedNationality } from '@/models/features/visit/blacklisted-nationality';
import { ModelInterceptorContract } from 'cast-response';

export class BlacklistedNationalityInterceptor
  implements ModelInterceptorContract<BlacklistedNationality>
{
  receive(model: BlacklistedNationality): BlacklistedNationality {
    // Here you can modify the model after receiving it from the server
    return model;
  }

  send(model: Partial<BlacklistedNationality>): Partial<BlacklistedNationality> {
    return model;
  }
}
