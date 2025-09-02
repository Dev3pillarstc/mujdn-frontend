import { BlacklistedNationalId } from '@/models/features/visit/blacklisted-national-id';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { BlacklistedNationalIdService } from '@/services/features/visit/blacklisted-national-id.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';

export const blacklistedNationalIdResolver: ResolveFn<
  PaginatedList<BlacklistedNationalId> | null
> = () => {
  const blacklistedNationalIdService = inject(BlacklistedNationalIdService);
  return blacklistedNationalIdService.loadPaginated(new PaginationParams()).pipe(
    catchError((error) => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
