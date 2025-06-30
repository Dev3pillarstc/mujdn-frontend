import Shift from '@/models/features/lookups/work-shifts/shift';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { ShiftService } from '@/services/features/lookups/shift.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';

export const workShiftResolver: ResolveFn<PaginatedList<Shift>> = (route, state) => {
  const shiftService = inject(ShiftService);
  return shiftService.loadPaginated(new PaginationParams());
};
