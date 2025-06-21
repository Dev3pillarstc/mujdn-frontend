// abstracts/base-crud-cast-service.ts
import { CastResponseCrud } from './cast-response-crud.decorator';
import { BaseCrudService } from './base-crud-service';

export function CastedCrudService<T>(model: () => new () => T) {
  @CastResponseCrud<T>(model)
  abstract class BaseCastedService extends BaseCrudService<T, any> {}
  return BaseCastedService;
}
