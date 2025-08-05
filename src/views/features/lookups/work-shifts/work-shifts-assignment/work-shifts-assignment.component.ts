import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { WorkShiftsListPopupComponent } from '../work-shifts-list-popup/work-shifts-list-popup.component';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { WorkShiftsAssignmentPopupComponent } from '../work-shifts-assignment-popup/work-shifts-assignment-popup.component';
import { TranslatePipe } from '@ngx-translate/core';
import UserWorkShift from '@/models/features/lookups/work-shifts/user-work-shifts';
import { UserWorkShiftService } from '@/services/features/lookups/user-workshift.service';
import ShiftsFilter from '@/models/features/lookups/work-shifts/shifts-filter';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import UserWorkShiftsFilter from '@/models/features/lookups/work-shifts/user-work-shifts-filter';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import Shift from '@/models/features/lookups/work-shifts/shift';
import { DIALOG_ENUM } from '@/enums/dialog-enum';

@Component({
  selector: 'app-work-shifts-assignment',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    Select,
    DatePickerModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './work-shifts-assignment.component.html',
  styleUrl: './work-shifts-assignment.component.scss',
})
export default class WorkShiftsAssignmentComponent extends BaseListComponent<
  UserWorkShift,
  WorkShiftsAssignmentPopupComponent,
  UserWorkShiftService,
  ShiftsFilter
> {
  usersProfiles: UsersWithDepartmentLookup[] = [];
  userWorkShift: UserWorkShift[] = [];
  departments: BaseLookupModel[] = [];
  filteredEmployees: UsersWithDepartmentLookup[] = [];
  filterOptions: UserWorkShiftsFilter = new UserWorkShiftsFilter();
  shifts: Shift[] = [];
  userworkShiftService = inject(UserWorkShiftService);
  override get filterModel(): UserWorkShiftsFilter {
    return this.filterOptions;
  }
  override set filterModel(val: UserWorkShiftsFilter) {
    this.filterOptions = val as UserWorkShiftsFilter;
  }
  override get service(): UserWorkShiftService {
    return this.userWorkShiftService;
  }
  override initListComponent(): void {
    var userShifts = this.activatedRoute.snapshot.data['list'].userShifts;
    this.shifts = this.activatedRoute.snapshot.data['list'].shifts;
    this.list = userShifts.list;
    this.paginationInfo = userShifts.paginationInfo;
    this.usersProfiles = this.activatedRoute.snapshot.data['list'].users;
    this.departments = this.activatedRoute.snapshot.data['list'].departments;
    this.filteredEmployees = this.usersProfiles;
  }
  filterEmployeesByDepartment(departmentId: number) {
    this.filteredEmployees = this.usersProfiles.filter((emp) => emp.departmentId === departmentId);
  }
  protected override mapModelToExcelRow(model: UserWorkShift): { [key: string]: any } {
    return {
      [this.translateService.instant('USER_WORK_SHIFT_PAGE.SHIFT_NAME_AR')]: model.shiftNameAr,
      [this.translateService.instant('USER_WORK_SHIFT_PAGE.SHIFT_NAME_EN')]: model.shiftNameEn,
      [this.translateService.instant('USER_WORK_SHIFT_PAGE.EMPLOYEE_NAME_AR')]:
        model.employeeNameAr,
      [this.translateService.instant('USER_WORK_SHIFT_PAGE.EMPLOYEE_NAME_EN')]:
        model.employeeNameEn,
      [this.translateService.instant('USER_WORK_SHIFT_PAGE.START_DATE')]: model.startDate,
      [this.translateService.instant('USER_WORK_SHIFT_PAGE.END_DATE')]: model.endDate,
    };
  }
  dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };
  userWorkShiftService = inject(UserWorkShiftService);
  dialog = inject(MatDialog);
  date2: Date | undefined;
  attendance!: any[];

  addOrEditModel(): void {
    this.openDialog();
  }
  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'USER_WORK_SHIFT_PAGE.WORK_SHIFT_ASSIGNMENT' }];
  }
  override openDialog() {
    const lookups = {
      usersProfiles: this.usersProfiles,
      departments: this.departments,
      shifts: this.shifts,
    };

    return this.openBaseDialog(
      WorkShiftsAssignmentPopupComponent as any,
      new UserWorkShift(),
      ViewModeEnum.CREATE,
      lookups
    );
  }
  get optionLabel(): string {
    const lang = this.langService.getCurrentLanguage();
    return lang === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }
}
