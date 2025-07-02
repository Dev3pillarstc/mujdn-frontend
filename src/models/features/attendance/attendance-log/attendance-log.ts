import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { AttendanceService } from '@/services/features/attendance.service';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { Validators } from '@angular/forms';

export class AttendanceLog extends BaseCrudModel<AttendanceLog, AttendanceService, string> {
  override $$__service_name__$$: string = 'AttendanceService';
  declare id: string;
  declare departmentId?: number;
  declare employeeId?: number;
  declare swipeTime?: string;
  declare identificationNumber?: string;
  declare channelName?: string | null;
  declare employeeNameEn?: string;
  declare employeeNameAr?: string;
  declare departmentNameEn?: string;
  declare departmentNameAr?: string;
  declare creatorNameEn?: string;
  declare creatorNameAr?: string;
  declare openType?: string | null;

  buildForm(viewMode: ViewModeEnum) {
    const { departmentId, identificationNumber, swipeTime } = this;

    const controls = {
      departmentId: [departmentId, viewMode === ViewModeEnum.CREATE ? [] : [Validators.required]],
      identificationNumber: [
        identificationNumber,
        viewMode === ViewModeEnum.CREATE ? [] : [Validators.required],
      ],
      swipeTime: [swipeTime, [Validators.required]],
    };

    return controls;
  }
}
