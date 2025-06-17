import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { AttendanceService } from '@/services/features/attendance.service';

export class AttendanceLog extends BaseCrudModel<AttendanceLog, AttendanceService> {
  override $$__service_name__$$: string = 'AttendanceService';
}
