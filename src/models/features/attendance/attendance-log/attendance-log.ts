import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { AttendanceService } from '@/services/features/attendance-log.service';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { AttendanceLogInterceptor } from '@/model-interceptors/features/attendance-log.interceptor';

const { send, receive } = new AttendanceLogInterceptor();

@InterceptModel({ send, receive })
export class AttendanceLog extends BaseCrudModel<AttendanceLog, AttendanceService, string> {
  override $$__service_name__$$: string = 'AttendanceService';
  declare id: string;
  declare departmentId?: number;
  declare employeeId?: number;
  declare swipeTime?: Date | string;
  declare nationalId?: string;
  declare channelName?: string | null;
  declare employeeNameEn?: string;
  declare employeeNameAr?: string;
  declare departmentNameEn?: string;
  declare departmentNameAr?: string;
  declare creatorNameEn?: string;
  declare creatorNameAr?: string;
  declare openType?: string | null;
  declare IsRowData?: boolean | null;

  declare selectedDate?: Date;
  declare selectedTime?: Date;

  buildForm(viewMode: ViewModeEnum) {
    const { departmentId, employeeId, nationalId, swipeTime, selectedDate, selectedTime } = this;

    const controls = {
      departmentId: [departmentId, viewMode === ViewModeEnum.CREATE ? [] : [Validators.required]],
      employeeId: [employeeId, viewMode === ViewModeEnum.CREATE ? [] : [Validators.required]],
      nationalId: [nationalId, viewMode === ViewModeEnum.CREATE ? [] : [Validators.required]],
      swipeTime: [swipeTime, [Validators.required]],
      selectedDate: [selectedDate],
      selectedTime: [selectedTime],
    };

    return controls;
  }
}
