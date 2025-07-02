import { Injectable } from '@angular/core';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { AttendanceLog } from '@/models/features/attendance/attendance-log/attendance-log';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService extends BaseCrudService<AttendanceLog, string> {
  serviceName: string = 'AttendanceService';

  getUrlSegment(): string {
    return this.urlService.URLS.ATTENDANCE;
  }
}
