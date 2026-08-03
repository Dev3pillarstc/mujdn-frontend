import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { ShiftInterceptor } from '@/model-interceptors/features/lookups/shift.interceptor';
import { ShiftService } from '@/services/features/lookups/shift.service';
import { timeStringToDate } from '@/utils/general-helper';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { ShiftDetails } from '@/models/features/lookups/work-shifts/shift-details';
import { RotationGroup } from '@/models/features/lookups/work-shifts/rotation-group';

const { send, receive } = new ShiftInterceptor();

@InterceptModel({ send, receive })
export default class Shift extends BaseCrudModel<Shift, ShiftService> {
  override $$__service_name__$$: string = 'ShiftService';
  declare concurrencyUpdateVersion?: Uint8Array;
  declare nameAr?: string;
  declare nameEn?: string;
  declare timeFrom?: string;
  declare timeTo?: string;
  declare dayBoundaryTime?: string;
  declare beforeAttendanceBuffer?: number;
  declare afterAttendanceBuffer?: number;
  declare beforeLeaveBuffer?: number;
  declare afterLeaveBuffer?: number;
  isDefaultShift?: boolean = false;
  declare shiftLogStartDate?: Date | string;
  declare shiftLogId?: number;
  isActive?: boolean = false;
  declare shiftActivationDate?: Date | string;
  declare activeShiftStartDate?: Date | string;
  isDefaultShiftForm?: boolean = false;
  isUpdateOnly: boolean = false;
  isAvailableDefaultShift?: boolean = false;
  declare defaultShiftId?: number;
  isCrossDayShift: boolean = false;
  declare shiftDetails: ShiftDetails;
  rotationGroups: RotationGroup[] = [];

  buildForm() {
    const {
      nameAr,
      nameEn,
      timeFrom,
      timeTo,
      dayBoundaryTime,
      beforeAttendanceBuffer,
      afterAttendanceBuffer,
      beforeLeaveBuffer,
      afterLeaveBuffer,
      isCrossDayShift,
      isDefaultShift,
      isDefaultShiftForm,
      isActive,
      shiftLogStartDate,
      isUpdateOnly,
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
          Validators.maxLength(CustomValidators.defaultLengths.ENGLISH_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('ENG_NUM'),
        ],
      ],
      timeFrom: [timeFrom ? timeStringToDate(timeFrom) : null, [Validators.required]],
      timeTo: [timeTo ? timeStringToDate(timeTo) : null, [Validators.required]],
      dayBoundaryTime: [],
      beforeAttendanceBuffer: [
        beforeAttendanceBuffer ?? 0,
        [
          CustomValidators.positiveNumber(),
          Validators.max(CustomValidators.defaultLengths.maxShiftBuffer),
        ],
      ],
      afterAttendanceBuffer: [
        afterAttendanceBuffer ?? 0,
        [
          CustomValidators.positiveNumber(),
          Validators.max(CustomValidators.defaultLengths.maxShiftBuffer),
        ],
      ],
      beforeLeaveBuffer: [
        beforeLeaveBuffer ?? 0,
        [
          CustomValidators.positiveNumber(),
          Validators.max(CustomValidators.defaultLengths.maxShiftBuffer),
        ],
      ],
      afterLeaveBuffer: [
        afterLeaveBuffer ?? 0,
        [
          CustomValidators.positiveNumber(),
          Validators.max(CustomValidators.defaultLengths.maxShiftBuffer),
        ],
      ],
      isCrossDayShift: [isCrossDayShift, []],
      isDefaultShift: [isDefaultShift, []],
      isDefaultShiftForm: [isDefaultShiftForm],
      shiftLogStartDate: [shiftLogStartDate],
      isActive: [isActive],
      isUpdateOnly: [isUpdateOnly],
    };
  }
}
