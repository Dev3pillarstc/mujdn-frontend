import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { TemporaryRoleAssignmentInterceptor } from '@/model-interceptors/features/temporary-role-assignment.interceptor';
import { TemporaryRoleAssignmentService } from '@/services/features/temporary-role-assignment.service';
import {
  convertUtcToSystemTimeZone,
  endOfDay,
  extractTime,
  startOfDay,
} from '@/utils/general-helper';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';

const { send, receive } = new TemporaryRoleAssignmentInterceptor();

@InterceptModel({ send, receive })
export class TemporaryRoleAssignment extends BaseCrudModel<
  TemporaryRoleAssignment,
  TemporaryRoleAssignmentService
> {
  override $$__service_name__$$: string = 'TemporaryRoleAssignmentService';

  declare fkUserProfileId: number;
  declare fkRoleId?: string | null;
  declare dateFrom: Date | string | null;
  declare dateTo: Date | string | null;
  declare userFullNameAr: string;
  declare userFullNameEn: string;
  declare departmentNameAr: string;
  declare departmentNameEn: string;
  declare roleName?: string | null;
  declare isCurrentlyActive: boolean;
  declare concurrencyUpdateVersion?: string;

  buildForm() {
    const { fkUserProfileId, dateFrom, dateTo } = this;

    return {
      fkUserProfileId: [fkUserProfileId, [Validators.required]],
      dateFrom: [dateFrom, [Validators.required]],
      dateTo: [dateTo, [Validators.required]],
      timeFrom: [extractTime(this.dateFrom) ?? startOfDay(), [Validators.required]],
      timeTo: [extractTime(this.dateTo) ?? endOfDay(), [Validators.required]],
    };
  }

  get hasStarted(): boolean {
    const dateFrom = this.normalizeDateTime(this.dateFrom);
    return !!dateFrom && dateFrom <= this.now;
  }

  get hasEnded(): boolean {
    const dateTo = this.normalizeDateTime(this.dateTo);
    return !!dateTo && dateTo <= this.now;
  }

  get isActiveNow(): boolean {
    return this.hasStarted && !this.hasEnded;
  }

  get isFutureRecord(): boolean {
    const dateFrom = this.normalizeDateTime(this.dateFrom);
    return !!dateFrom && dateFrom > this.now;
  }

  get canEdit(): boolean {
    return !this.hasEnded;
  }

  get canDelete(): boolean {
    return this.isFutureRecord;
  }

  get isDateToOnlyEditable(): boolean {
    return this.isActiveNow;
  }

  get hasEndedOrEndsToday(): boolean {
    return this.hasEnded;
  }

  private get now(): Date {
    const now = new Date();
    return convertUtcToSystemTimeZone(now);
  }

  private normalizeDateTime(value: Date | string | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    return new Date(value);
  }
}
