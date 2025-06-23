import { City } from '@/models/features/lookups/City/city';
import { ModelInterceptorContract } from 'cast-response';

export class CityInterceptor implements ModelInterceptorContract<City> {
  receive(model: City): City {
    // Here you can modify the model after receiving it from the server
    return model;
  }
  send(model: Partial<City>): Partial<City> {
    return model;
  }
}
