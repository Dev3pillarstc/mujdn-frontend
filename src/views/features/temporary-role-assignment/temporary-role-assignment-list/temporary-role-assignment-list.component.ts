import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { TemporaryRoleAssignmentFilter } from '@/models/features/temporary-role-assignment/temporary-role-assignment-filter';
import { TemporaryRoleAssignment } from '@/models/features/temporary-role-assignment/temporary-role-assignment';
import { UserService } from '@/services/features/user.service';
import { TemporaryRoleAssignmentService } from '@/services/features/temporary-role-assignment.service';
import { AuthService } from '@/services/auth/auth.service';
import { formatDateOnly } from '@/utils/general-helper';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { DatePickerModule } from 'primeng/datepicker';
import { PaginatorModule } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Router, RouterModule } from '@angular/router';
import { TemporaryRoleAssignmentPopupComponent } from '../temporary-role-assignment-popup/temporary-role-assignment-popup.component';

@Component({
  selector: 'app-temporary-role-assignment-list',
  imports: [
    Breadcrumb,
    TableModule,
    PaginatorModule,
    Select,
    DatePickerModule,
    FormsModule,
    TranslatePipe,
    CommonModule,
    RouterModule,
  ],
  providers: [TemporaryRoleAssignmentService],
  templateUrl: './temporary-role-assignment-list.component.html',
  styleUrl: './temporary-role-assignment-list.component.scss',
})
export default class TemporaryRoleAssignmentListComponent extends BaseListComponent<
  TemporaryRoleAssignment,
  TemporaryRoleAssignmentPopupComponent,
  TemporaryRoleAssignmentService,
  TemporaryRoleAssignmentFilter
> {
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };

  temporaryRoleAssignmentService = inject(TemporaryRoleAssignmentService);
  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);
  filterModel: TemporaryRoleAssignmentFilter = new TemporaryRoleAssignmentFilter();
  employees: UsersWithDepartmentLookup[] = [];

  override get service(): TemporaryRoleAssignmentService {
    return this.temporaryRoleAssignmentService;
  }

  get canManageTemporaryRoleAssignments(): boolean {
    return this.authService.hasRouteAccess({ actualDepartmentManagerOnly: true });
  }

  set dateFrom(value: Date | null) {
    this.filterModel.dateFrom = value;

    // If dateTo is before dateFrom, reset or adjust it
    if (this.filterModel.dateTo && value && this.filterModel.dateTo < value) {
      this.filterModel.dateTo = null; // or set it to value
    }
  }

  override initListComponent(): void {
    if (!this.canManageTemporaryRoleAssignments) {
      this.router.navigate(['/403']);
      return;
    }

    this.userService.getMyDepartmentUsersLookup().subscribe((employees) => {
      this.employees = employees;
    });
  }

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'TEMPORARY_ROLE_ASSIGNMENT_PAGE.TEMPORARY_ROLE_ASSIGNMENTS' }];
  }

  override openDialog(model: TemporaryRoleAssignment): void {
    if (!this.canManageTemporaryRoleAssignments) {
      return;
    }

    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;

    this.openBaseDialog(TemporaryRoleAssignmentPopupComponent as any, model, viewMode, {
      employees: this.employees,
    });
  }

  addOrEditModel(model?: TemporaryRoleAssignment): void {
    this.openDialog(model ?? new TemporaryRoleAssignment());
  }

  getPropertyName(): string {
    return this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }

  getEmployeeName(model: TemporaryRoleAssignment): string {
    return this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH
      ? model.userFullNameEn
      : model.userFullNameAr;
  }

  formatDate(value: Date | string | null | undefined): string {
    return value ? formatDateOnly(value) : '-';
  }

  getStatusKey(model: TemporaryRoleAssignment): string {
    if (model.hasEndedOrEndsToday) {
      return 'TEMPORARY_ROLE_ASSIGNMENT_PAGE.ENDED';
    }

    if (model.hasStarted) {
      return 'TEMPORARY_ROLE_ASSIGNMENT_PAGE.ACTIVE_NOW';
    }

    return 'TEMPORARY_ROLE_ASSIGNMENT_PAGE.SCHEDULED';
  }

  getStatusClass(model: TemporaryRoleAssignment): string {
    if (model.hasEndedOrEndsToday) {
      return 'text-[#912018] bg-[#fef3f2]';
    }

    if (model.hasStarted) {
      return 'text-[#085d3a] bg-[#ecfdf3]';
    }

    return 'text-[#1849a9] bg-[#eff8ff]';
  }

  protected override mapModelToExcelRow(
    model: TemporaryRoleAssignment
  ): Record<string, string | number | boolean | null | undefined> {
    return {
      [this.translateService.instant('TEMPORARY_ROLE_ASSIGNMENT_PAGE.EMPLOYEE_NAME')]:
        this.getEmployeeName(model),
      [this.translateService.instant('TEMPORARY_ROLE_ASSIGNMENT_PAGE.TEMPORARY_ROLE')]:
        model.roleName || '',
      [this.translateService.instant('TEMPORARY_ROLE_ASSIGNMENT_PAGE.DATE_FROM')]: this.formatDate(
        model.dateFrom
      ),
      [this.translateService.instant('TEMPORARY_ROLE_ASSIGNMENT_PAGE.DATE_TO')]: this.formatDate(
        model.dateTo
      ),
      [this.translateService.instant('TEMPORARY_ROLE_ASSIGNMENT_PAGE.CURRENT_STATUS')]:
        this.translateService.instant(this.getStatusKey(model)),
    };
  }
}
