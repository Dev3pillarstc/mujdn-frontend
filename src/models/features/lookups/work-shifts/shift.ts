import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { ShiftInterceptor } from '@/model-interceptors/features/lookups/shift.interceptor';
import { ShiftService } from '@/services/features/lookups/shift.service';
import { timeStringToDate } from '@/utils/general-helper';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';

const { send, receive } = new ShiftInterceptor();

@InterceptModel({ send, receive })
export default class Shift extends BaseCrudModel<Shift, ShiftService> {
  override $$__service_name__$$: string = 'ShiftService';
  declare concurrencyUpdateVersion?: Uint8Array;
  declare nameAr?: string;
  declare nameEn?: string;
  declare timeFrom?: string;
  declare timeTo?: string;
  declare attendanceBuffer?: number;
  declare leaveBuffer?: number;
  isDefaultShift?: boolean = false;
  declare shiftLogStartDate?: Date | string;
  declare shiftLogId?: number;
  declare isActive?: boolean;
  declare shiftActivationDate?: Date | string;
  declare activeShiftStartDate?: Date | string;
  declare isDefaultShiftForm?: boolean;

  buildForm() {
    const {
      nameAr,
      nameEn,
      timeFrom,
      timeTo,
      attendanceBuffer,
      leaveBuffer,
      isDefaultShift,
      isDefaultShiftForm,
      isActive,
    } = this;

    return {
      nameAr: [
        nameAr,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.ARABIC_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('AR_NUM'),
        ],
      ],
      nameEn: [
        nameEn,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.ENGLISH_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('ENG_NUM'),
        ],
      ],
      timeFrom: [timeFrom ? timeStringToDate(timeFrom) : null, [Validators.required]],
      timeTo: [timeTo ? timeStringToDate(timeTo) : null, [Validators.required]],
      attendanceBuffer: [
        attendanceBuffer,
        [
          CustomValidators.numberMaxLength(CustomValidators.defaultLengths.NUMBERS_MAXLENGTH),
          CustomValidators.positiveNumber(),
        ],
      ],
      leaveBuffer: [
        leaveBuffer,
        [
          CustomValidators.numberMaxLength(CustomValidators.defaultLengths.NUMBERS_MAXLENGTH),
          CustomValidators.positiveNumber(),
        ],
      ],
      isDefaultShift: [isDefaultShift, []],
      isDefaultShiftForm: [isDefaultShiftForm ?? false, []],
      isActive: [isActive ?? false, []],
    };
  }
}
