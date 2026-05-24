import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { EmployeeShiftDayInterceptor } from '@/model-interceptors/features/lookups/employee-shift-day.interceptor';
import { EmployeeShiftDayService } from '@/services/features/lookups/employee-shift-day.service';
import { InterceptModel } from 'cast-response';

const { send, receive } = new EmployeeShiftDayInterceptor();

@InterceptModel({ send, receive })
export default class EmployeeShiftDay extends BaseCrudModel<EmployeeShiftDay, EmployeeShiftDayService> {
  override $$__service_name__$$: string = 'EmployeeShiftDayService';
  declare id: number;
  declare employeeName: { id: number; nameAr: string; nameEn: string };
  declare shiftDetails: { id: number; nameAr: string; nameEn: string };
  declare shiftAssignmentType: number;
  declare dateFrom: string;
  declare dateTo: string;
  declare timeFrom: string;
  declare timeTo: string;
  declare isRestDay: boolean;

  formattedTimeRange?: string;
}
