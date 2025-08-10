import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { MyShiftsInterceptor } from '@/model-interceptors/features/lookups/my-shifts.interceptor';
import { MyShiftsService } from '@/services/features/lookups/my-shifts.service';
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
  declare attendanceBuffer?: number;
  declare leaveBuffer?: number;
  declare employeeWorkingDays: string;
  declare startDate: Date | string;
  declare endDate: Date | string;
}
