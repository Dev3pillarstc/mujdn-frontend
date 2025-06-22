import { Region } from '@/models/features/lookups/region/region';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { RegionService } from '@/services/features/lookups/region.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

export const regionResolver: ResolveFn<PaginatedList<Region>> = () => {
  const regionService = inject(RegionService);
  return regionService.loadPaginated(new PaginationParams());
};
