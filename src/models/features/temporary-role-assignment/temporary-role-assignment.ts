import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { TemporaryRoleAssignmentInterceptor } from '@/model-interceptors/features/temporary-role-assignment.interceptor';
import { TemporaryRoleAssignmentService } from '@/services/features/temporary-role-assignment.service';
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
    };
  }

  get hasStarted(): boolean {
    const dateFrom = this.normalizeDate(this.dateFrom);
    return !!dateFrom && dateFrom <= this.today;
  }

  get hasEndedOrEndsToday(): boolean {
    const dateTo = this.normalizeDate(this.dateTo);
    return !!dateTo && dateTo <= this.today;
  }

  get isFutureRecord(): boolean {
    const dateFrom = this.normalizeDate(this.dateFrom);
    return !!dateFrom && dateFrom > this.today;
  }

  get canEdit(): boolean {
    return !this.hasEndedOrEndsToday;
  }

  get canDelete(): boolean {
    return this.isFutureRecord;
  }

  get isDateToOnlyEditable(): boolean {
    return this.hasStarted && !this.hasEndedOrEndsToday;
  }

  private get today(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  private normalizeDate(value: Date | string | null | undefined): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }
}
