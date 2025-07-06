import { Injectable } from '@angular/core';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { AttendanceLog } from '@/models/features/attendance/attendance-log/attendance-log';
import { CastResponseContainer } from 'cast-response';
import { PaginatedList } from '@/models/shared/response/paginated-list';

@Injectable({
  providedIn: 'root',
})
@CastResponseContainer({
  $default: {
    model: () => AttendanceLog,
  },
  $pagination: {
    model: () => PaginatedList<AttendanceLog>,
    unwrap: 'data',
    shape: { 'list.*': () => AttendanceLog },
  },
})
export class AttendanceService extends BaseCrudService<AttendanceLog, string> {
  serviceName: string = 'AttendanceService';

  getUrlSegment(): string {
    return this.urlService.URLS.ATTENDANCE;
  }
}
