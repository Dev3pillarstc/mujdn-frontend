import { ModelInterceptorContract } from 'cast-response';
import { Example } from '@/models/example';

export class ExampleInterceptor implements ModelInterceptorContract<Example> {
  send(model: Partial<Example>): Partial<Example> {
    return model;
  }

  receive(model: Example): Example {
    return model;
  }
}
