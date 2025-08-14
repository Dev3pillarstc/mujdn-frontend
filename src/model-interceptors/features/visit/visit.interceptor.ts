import { Visit } from '@/models/features/visit/visit';
import { ModelInterceptorContract } from 'cast-response';

export class VisitInterceptor implements ModelInterceptorContract<Visit> {
  receive(model: Visit): Visit {
    // Here you can modify the model after receiving it from the server
    return model;
  }

  send(model: Partial<Visit>): Partial<Visit> {
    return model;
  }
}
