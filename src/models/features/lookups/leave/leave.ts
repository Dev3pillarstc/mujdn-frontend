import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { LeaveService } from '@/services/features/lookups/leave.service';
import { InterceptModel } from 'cast-response';
import { LeaveInterceptor } from '@/model-interceptors/features/lookups/leave-interceptor';
import { Validators } from '@angular/forms';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { LEAVE_STATUS_ENUM } from '@/enums/leave-status-enum';
import { Attachment } from '@/models/shared/attachment/attachment';
import { TemporaryUpload } from '@/models/shared/attachment/temporary-upload';

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
  // Files already stored against this leave; always present on read, never sent back
  attachments: Attachment[] = [];
  // Files staged for a leave that does not exist yet. Attachments can only be linked at
  // creation time, so this is write-once: the create payload carries their ids and the
  // edit payload never mentions them — which is why the popup drops this control when
  // editing rather than leaving a required field nobody can satisfy.
  temporaryUploads: TemporaryUpload[] = [];

  buildForm() {
    const { fkEmployeeId, fkLeaveTypeId, dateFrom, dateTo, temporaryUploads } = this;
    return {
      fkEmployeeId: [fkEmployeeId, [Validators.required]],
      fkLeaveTypeId: [fkLeaveTypeId, [Validators.required]],
      dateFrom: [dateFrom, [Validators.required]],
      dateTo: [dateTo, [Validators.required]],
      // `required` rejects an empty array, so a leave cannot be created with no file.
      temporaryUploads: [temporaryUploads ?? [], [Validators.required]],
    };
  }

  isNew(): boolean {
    return this.status === LEAVE_STATUS_ENUM.New;
  }

  isAccepted(): boolean {
    return this.status === LEAVE_STATUS_ENUM.Accepted;
  }
}
