import { City } from '@/models/features/lookups/city/city';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { CityService } from '@/services/features/lookups/city.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';

export const cityResolver: ResolveFn<PaginatedList<City> | null> = () => {
  const cityService = inject(CityService);
  return cityService.loadPaginated(new PaginationParams()).pipe(
    catchError((error) => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
