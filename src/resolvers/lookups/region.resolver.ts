import { Region } from '@/models/features/lookups/region/region';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { RegionService } from '@/services/features/lookups/region.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';

export const regionResolver: ResolveFn<PaginatedList<Region> | null> = () => {
  const regionService = inject(RegionService);
  return regionService.loadPaginated(new PaginationParams()).pipe(
    catchError((error) => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
