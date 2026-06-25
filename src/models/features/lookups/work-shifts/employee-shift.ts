import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { WorkShiftType } from '@/enums/work-shift-type';
import { MyShiftsInterceptor } from '@/model-interceptors/features/lookups/my-shifts.interceptor';
import { MyShiftsService } from '@/services/features/lookups/my-shifts.service';
import { RotationGroup } from '@/models/features/lookups/work-shifts/rotation-group';
import { ShiftDetails } from '@/models/features/lookups/work-shifts/shift-details';
import { InterceptModel } from 'cast-response';

const { send, receive } = new MyShiftsInterceptor();
@InterceptModel({ send, receive })
export default class EmployeeShift extends BaseCrudModel<EmployeeShift, MyShiftsService> {
  override $$__service_name__$$: string = 'MyShiftsService';
  declare id: number;
  declare nameAr?: string;
  declare nameEn?: string;
  declare timeFrom?: string;
  declare timeTo?: string;
  declare dayBoundaryTime?: string;
  declare attendanceBuffer?: number;
  declare leaveBuffer?: number;
  declare employeeWorkingDays: string;
  declare startDate: Date | string;
  declare endDate: Date | string;
  declare workShiftType: WorkShiftType;
  declare presenceInquiryTime: string;
  declare presenceInquiryBuffer?: number;
  /**
   * `true` when today is a rest day for this shift assignment.
   * Returned by the backend; only meaningful for rotating shifts.
   */
  declare isRestDay?: boolean;
  /**
   * Index (0-based) of the rotation group the employee currently belongs to.
   * `null` when outside the active rotation window.
   */
  declare resolvedPeriodOrder?: number | null;
  /** Populated for non-rotating shifts (Standard, WeekOnWeekOff, WeekOnWeekOff24). */
  declare shiftDetails?: ShiftDetails;
  /** Populated for Rotating shifts — one entry per rotation slot. */
  rotationGroups?: RotationGroup[];

  formattedTimeFrom?: string;
  formattedTimeTo?: string;
}
