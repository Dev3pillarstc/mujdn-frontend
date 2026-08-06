import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogConfig } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { Leave } from '@/models/features/lookups/leave/leave';
import { LeaveFilter } from '@/models/features/lookups/leave/leave-filter';
import { LeaveService } from '@/services/features/lookups/leave.service';
import { LeaveTypeService } from '@/services/features/lookups/leave-type.service';
import { UserService } from '@/services/features/user.service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { LEAVE_STATUS_ENUM } from '@/enums/leave-status-enum';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { LeavesViewPopupComponent } from '../leaves-view-popup/leaves-view-popup.component';
import { LeavesAddEditPopupComponent } from '../leaves-add-edit-popup/leaves-add-edit-popup.component';
import { formatDateOnly } from '@/utils/general-helper';
import { CustomValidators } from '@/validators/custom-validators';
import { PaginationInfo } from '@/models/shared/response/pagination-info';

@Component({
  selector: 'app-other-leaves',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    DatePickerModule,
    SelectModule,
    InputTextModule,
    TranslatePipe,
  ],
  templateUrl: './other-leaves.component.html',
  styleUrl: './other-leaves.component.scss',
})
export class OtherLeavesComponent
  extends BaseListComponent<Leave, LeavesAddEditPopupComponent, LeaveService, LeaveFilter>
  implements OnInit
{
  override dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };
  leaveService = inject(LeaveService);
  leaveTypeService = inject(LeaveTypeService);
  userService = inject(UserService);
  filterModel: LeaveFilter = new LeaveFilter();
  leaveTypes: BaseLookupModel[] = [];
  employees: UsersWithDepartmentLookup[] = [];
  departments: BaseLookupModel[] = [];
  leaveStatusEnum = LEAVE_STATUS_ENUM;

  override get service() {
    return this.leaveService;
  }

  override initListComponent(): void {
    // The container route resolves the MY-leaves list; this embedded tab must not
    // consume (or mutate) that shared snapshot state — start fresh and load its own page.
    this.list = [];
    this.paginationInfo = new PaginationInfo();
    this.loadLookups();
    this.loadList().subscribe({
      next: (response) => this.handleLoadListSuccess(response),
      error: () => this.handleLoadListError(),
    });
  }

  loadLookups(): void {
    this.leaveTypeService.getLookup().subscribe((res) => {
      this.leaveTypes = res;
    });
    this.userService.getMyDepartmentUsersLookup().subscribe((res) => {
      this.employees = res;
    });
    this.userService.getMyDepartmentsLookup().subscribe((res) => {
      this.departments = res;
    });
  }

  override loadList() {
    return this.service.loadMyCreatedLeavesPaginated(this.paginationParams, {
      ...this.appliedFilterModel!,
    });
  }

  override openDialog(model: Leave): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = { model };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    this.matDialog.open(LeavesViewPopupComponent as any, dialogConfig);
  }

  addOrEditModel(leave?: Leave): void {
    const model = leave ?? new Leave();
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(LeavesAddEditPopupComponent as any, model, viewMode, {
      employees: this.employees,
      departments: this.departments,
      leaveTypes: this.leaveTypes,
    });
  }

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'LEAVES_PAGE.OTHER_LEAVES_LIST' }];
  }

  protected override getPdfExportRequest(): Observable<Blob> {
    return this.service.exportMyCreatedLeavesPdf(
      this.langService.getCurrentLanguage(),
      this.getPdfExportFilterOptions()
    );
  }

  override exportExcel(fileName: string = 'data.xlsx'): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
    };

    this.service
      .loadMyCreatedLeavesPaginated(allDataParams, { ...this.appliedFilterModel! })
      .subscribe({
        next: (response) => {
          const fullList = response.list || [];
          if (fullList.length === 0) {
            this.alertsService.showErrorMessage({ messages: ['COMMON.NO_DATA_TO_EXPORT'] });
            return;
          }
          this.writeExcelFile(this.mapModelsToExcelRows(fullList), fileName);
        },
        error: (_) => {
          this.alertsService.showErrorMessage({ messages: ['COMMON.ERROR'] });
        },
      });
  }

  protected override mapModelToExcelRow(model: Leave): { [key: string]: any } {
    return {
      [this.translateService.instant('LEAVES_PAGE.NATIONAL_ID')]: model.employee?.nationalId ?? '',
      [this.translateService.instant('LEAVES_PAGE.DEPARTMENT')]: this.departmentName(model),
      [this.translateService.instant('LEAVES_PAGE.EMPLOYEE_NAME')]: this.employeeName(model),
      [this.translateService.instant('LEAVES_PAGE.LEAVE_TYPE')]: this.leaveTypeName(model),
      [this.translateService.instant('LEAVES_PAGE.DATE_FROM')]: formatDateOnly(model.dateFrom),
      [this.translateService.instant('LEAVES_PAGE.DATE_TO')]: formatDateOnly(model.dateTo),
      [this.translateService.instant('LEAVES_PAGE.REQUEST_STATUS')]: this.getStatusText(
        model.status
      ),
    };
  }

  get optionLabel(): string {
    return this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }

  get requestStatuses(): { id: number; label: string }[] {
    return [
      { id: LEAVE_STATUS_ENUM.New, label: this.translateService.instant('LEAVES_PAGE.NEW') },
      {
        id: LEAVE_STATUS_ENUM.Accepted,
        label: this.translateService.instant('LEAVES_PAGE.ACCEPTED'),
      },
      {
        id: LEAVE_STATUS_ENUM.Rejected,
        label: this.translateService.instant('LEAVES_PAGE.REJECTED'),
      },
    ];
  }

  get filteredEmployees(): UsersWithDepartmentLookup[] {
    return this.filterModel.fkDepartmentId
      ? this.employees.filter((emp) => emp.departmentId === this.filterModel.fkDepartmentId)
      : this.employees;
  }

  onDepartmentChange(): void {
    if (
      this.filterModel.fkEmployeeId &&
      !this.filteredEmployees.some((emp) => emp.id === this.filterModel.fkEmployeeId)
    ) {
      this.filterModel.fkEmployeeId = null;
    }
  }

  employeeName(leave: Leave): string {
    const lang = this.langService.getCurrentLanguage();
    return (
      (lang === LANGUAGE_ENUM.ARABIC
        ? leave.employee?.nameAr
        : (leave.employee?.nameEn ?? leave.employee?.nameAr)) ?? ''
    );
  }

  departmentName(leave: Leave): string {
    const lang = this.langService.getCurrentLanguage();
    return (
      (lang === LANGUAGE_ENUM.ARABIC
        ? leave.employee?.department?.nameAr
        : (leave.employee?.department?.nameEn ?? leave.employee?.department?.nameAr)) ?? ''
    );
  }

  leaveTypeName(leave: Leave): string {
    const lang = this.langService.getCurrentLanguage();
    return (
      (lang === LANGUAGE_ENUM.ARABIC
        ? leave.leaveType?.nameAr
        : (leave.leaveType?.nameEn ?? leave.leaveType?.nameAr)) ?? ''
    );
  }

  getStatusBadgeClass(status: number): string {
    switch (status) {
      case LEAVE_STATUS_ENUM.New:
        return 'text-[14px] text-[#1849a9] min-h-[24px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#eff8ff] font-medium';
      case LEAVE_STATUS_ENUM.Accepted:
        return 'text-[14px] text-[#085d3a] min-h-[24px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#ecfdf3] font-medium';
      case LEAVE_STATUS_ENUM.Rejected:
        return 'text-[14px] text-[#912018] min-h-[24px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#fef3f2] font-medium';
      default:
        return 'text-[14px] text-gray-600 px-2 py-1 rounded-full bg-gray-100 font-medium';
    }
  }

  getStatusBadgeDotClass(status: number): string {
    switch (status) {
      case LEAVE_STATUS_ENUM.New:
        return 'w-[10px] h-[10px] bg-[#1849a9] rounded-full';
      case LEAVE_STATUS_ENUM.Accepted:
        return 'w-[10px] h-[10px] bg-[#085d3a] rounded-full';
      case LEAVE_STATUS_ENUM.Rejected:
        return 'w-[10px] h-[10px] bg-[#912018] rounded-full';
      default:
        return 'w-[10px] h-[10px] bg-gray-600 rounded-full';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case LEAVE_STATUS_ENUM.New:
        return this.translateService.instant('LEAVES_PAGE.NEW');
      case LEAVE_STATUS_ENUM.Accepted:
        return this.translateService.instant('LEAVES_PAGE.ACCEPTED');
      case LEAVE_STATUS_ENUM.Rejected:
        return this.translateService.instant('LEAVES_PAGE.REJECTED');
      default:
        return '';
    }
  }
}
