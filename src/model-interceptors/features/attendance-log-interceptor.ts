import { AttendanceLog } from '@/models/features/attendance/attendance-log/attendance-log';
import { ModelInterceptorContract } from 'cast-response';
import { toLocalTime } from '@/utils/general-helper';

export class AttendanceLogInterceptor implements ModelInterceptorContract<AttendanceLog> {
  receive(model: AttendanceLog): AttendanceLog {
    model['swipeTime'] = toLocalTime(model['swipeTime']);
    model['selectedDate'] = toLocalTime(model['selectedDate']);
    model['selectedTime'] = toLocalTime(model['selectedTime']);
    return model;
  }

  send(model: Partial<AttendanceLog>): Partial<AttendanceLog> {
    delete (model as any)['languageService'];
    return model;
  }
}
