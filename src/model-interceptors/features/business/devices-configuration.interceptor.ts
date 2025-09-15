import { DevicesConfiguration } from '@/models/features/business/devices-configuration';
import { ModelInterceptorContract } from 'cast-response';

export class DevicesConfigurationInterceptor
  implements ModelInterceptorContract<DevicesConfiguration>
{
  receive(model: DevicesConfiguration): DevicesConfiguration {
    return model;
  }

  send(model: Partial<DevicesConfiguration>): Partial<DevicesConfiguration> {
    delete model.accessLocation;
    delete (model as any).languageService;
    return model;
  }
}
