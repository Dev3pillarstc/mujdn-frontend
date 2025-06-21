// decorators/cast-response-crud.decorator.ts
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { CastResponseContainer } from 'cast-response';

export function CastResponseCrud<T>(model: () => new () => T) {
  return CastResponseContainer({
    $default: {
      model,
    },
    $pagination: {
      model: () => PaginatedList<T>,
      unwrap: 'data',
      shape: { 'list.*': model },
    },
  });
}
