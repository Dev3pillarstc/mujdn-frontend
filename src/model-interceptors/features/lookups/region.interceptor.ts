import { Region } from '@/models/features/lookups/region/region';
import { ModelInterceptorContract } from 'cast-response';

export class RegionInterceptor implements ModelInterceptorContract<Region> {
  receive(model: Region): Region {
    return model;
  }

  send(model: Partial<Region>): Partial<Region> {
    return model;
  }
}
