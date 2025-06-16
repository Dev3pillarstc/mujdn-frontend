import { City } from '@/models/features/lookups/City/city';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { CityService } from '@/services/features/lookups/city.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

export const cityResolver: ResolveFn<PaginatedList<City>> = () => {
  const cityService = inject(CityService);
  return cityService.loadPaginated(new PaginationParams());
};
