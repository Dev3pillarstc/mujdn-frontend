import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { AttendanceLog } from '@/models/features/attendance/attendance-log/attendance-log';
import { AttendanceService } from '@/services/features/attendance-log.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

export const attendanceResolver: ResolveFn<PaginatedList<AttendanceLog> | null> = () => {
  const attendanceService = inject(AttendanceService);
  return attendanceService.loadPaginatedSP(new PaginationParams()).pipe(
    catchError((error) => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
