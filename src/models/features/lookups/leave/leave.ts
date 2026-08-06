import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { LeaveService } from '@/services/features/lookups/leave.service';
import { InterceptModel } from 'cast-response';
import { LeaveInterceptor } from '@/model-interceptors/features/lookups/leave-interceptor';
import { Validators } from '@angular/forms';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { LEAVE_STATUS_ENUM } from '@/enums/leave-status-enum';

const { send, receive } = new LeaveInterceptor();

export class LeaveEmployeeLookup extends UsersWithDepartmentLookup {
  declare department?: BaseLookupModel;
}

@InterceptModel({ send, receive })
export class Leave extends BaseCrudModel<Leave, LeaveService> {
  override $$__service_name__$$: string = 'LeaveService';
  declare fkEmployeeId: number;
  declare employee?: LeaveEmployeeLookup | null;
  declare dateFrom: Date | string;
  declare dateTo: Date | string;
  declare fkLeaveTypeId: number;
  declare leaveType?: BaseLookupModel | null;
  declare status: LEAVE_STATUS_ENUM;
  declare rejectionNotes?: string | null;
  declare creationUserId?: number | null;
  declare creationUser?: UsersWithDepartmentLookup | null;
  declare actionDate?: Date | string | null;
  declare canTakeAction?: boolean;
  // Opaque Base64 row-version; never generated or edited on the frontend
  declare concurrencyUpdateVersion?: string | null;

  buildForm() {
    const { fkEmployeeId, fkLeaveTypeId, dateFrom, dateTo } = this;
    return {
      fkEmployeeId: [fkEmployeeId, [Validators.required]],
      fkLeaveTypeId: [fkLeaveTypeId, [Validators.required]],
      dateFrom: [dateFrom, [Validators.required]],
      dateTo: [dateTo, [Validators.required]],
    };
  }

  isNew(): boolean {
    return this.status === LEAVE_STATUS_ENUM.New;
  }
}
