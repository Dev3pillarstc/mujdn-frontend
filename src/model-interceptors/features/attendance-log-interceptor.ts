import { AttendanceLog } from '@/models/features/attendance/attendance-log/attendance-log';
import { ModelInterceptorContract } from 'cast-response';
import { toLocalTime } from '@/utils/general-helper';

export class AttendanceLogInterceptor implements ModelInterceptorContract<AttendanceLog> {
  receive(model: AttendanceLog): AttendanceLog {
    model['swipeTime'] = toLocalTime(model['swipeTime']);
    return model;
  }

  send(model: Partial<AttendanceLog>): Partial<AttendanceLog> {
    delete (model as any)['languageService'];
    delete (model as any)['selectedDate'];
    delete (model as any)['selectedTime'];
    delete (model as any)['channelName'];
    delete (model as any)['employeeNameEn'];
    delete (model as any)['employeeNameAr'];
    delete (model as any)['departmentNameEn'];
    delete (model as any)['departmentNameAr'];
    delete (model as any)['creatorNameEn'];
    delete (model as any)['creatorNameAr'];
    delete (model as any)['openType'];
    return model;
  }
}
