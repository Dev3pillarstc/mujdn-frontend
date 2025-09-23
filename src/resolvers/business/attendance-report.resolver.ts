import AttendanceReport from '@/models/features/attendance/attendance-report/attendance-report';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { AttendanceReportService } from '@/services/features/attendance-report.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';

export const attendanceReportResolver: ResolveFn<PaginatedList<AttendanceReport> | null> = () => {
  const attendanceReportService = inject(AttendanceReportService);
  return attendanceReportService.loadMyAttendanceReportsPaginated(new PaginationParams()).pipe(
    catchError(() => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
