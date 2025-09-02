import { BlacklistedNationality } from '@/models/features/visit/blacklisted-nationality';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { BlacklistedNationalityService } from '@/services/features/visit/blacklisted-nationality.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';

export const blacklistedNationalityResolver: ResolveFn<
  PaginatedList<BlacklistedNationality> | null
> = () => {
  const blacklistedNationalityService = inject(BlacklistedNationalityService);
  return blacklistedNationalityService.loadPaginated(new PaginationParams()).pipe(
    catchError((error) => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
