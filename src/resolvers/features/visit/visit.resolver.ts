import { Visit } from '@/models/features/visit/visit';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { VisitService } from '@/services/features/visit/visit.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';

export const visitResolver: ResolveFn<PaginatedList<Visit> | null> = () => {
  const visitService = inject(VisitService);
  return visitService.loadMyCreatedVisitsPaginated(new PaginationParams()).pipe(
    catchError((error) => {
      return of(null);
    })
  );
};
