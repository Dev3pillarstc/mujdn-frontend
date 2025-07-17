import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { ShiftInterceptor } from '@/model-interceptors/features/lookups/shift.interceptor';
import { ShiftService } from '@/services/features/lookups/shift.service';
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

  buildForm() {
    const { nameAr, nameEn, timeFrom, timeTo, attendanceBuffer, leaveBuffer, isDefaultShift } =
      this;

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
      timeFrom: [timeFrom ? this.timeStringToDate(timeFrom) : null, [Validators.required]],
      timeTo: [timeTo ? this.timeStringToDate(timeTo) : null, [Validators.required]],
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
    };
  }

  private timeStringToDate(value: string): Date {
    const [hours, minutes, seconds] = value.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0, 0);
    return date;
  }
}
