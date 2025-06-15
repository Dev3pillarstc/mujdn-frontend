import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { NationalityService } from '@/services/features/lookups/nationality.service';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Nationality } from '@/models/features/lookups/Nationality';
import { PaginationParams } from '@/models/shared/pagination-params';

export const nationalitiesResolver: ResolveFn<PaginatedList<Nationality>> = () => {
  const nationalityService = inject(NationalityService);
  return nationalityService.loadPaginated(new PaginationParams());
};
