import { Holiday } from '@/models/features/lookups/holiday/holiday';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { HolidayService } from '@/services/features/lookups/holiday.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

export const holidayResolver: ResolveFn<PaginatedList<Holiday>> = () => {
  const holidayService = inject(HolidayService);
  return holidayService.loadPaginated(new PaginationParams());
};
