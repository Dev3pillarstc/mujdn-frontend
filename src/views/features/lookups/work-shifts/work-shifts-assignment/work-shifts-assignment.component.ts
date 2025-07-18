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
interface Adminstration {
  type: string;
}
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
    throw new Error('Method not implemented.');
  }
  // items: MenuItem[] | undefined;
  override breadcrumbs: MenuItem[] | undefined;
  dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };
  userWorkShiftService = inject(UserWorkShiftService);
  dialog = inject(MatDialog);
  // override home: MenuItem | undefined;
  date2: Date | undefined;
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  attendance!: any[];
  // first: number = 0;
  // rows: number = 10;
  // matDialog = inject(MatDialog);

  // constructor() { }

  override ngOnInit() {
    super.ngOnInit();
    this.breadcrumbs = [{ label: 'لوحة المعلومات' }, { label: 'اسناد ورديات عمل' }];
    this.attendance = [
      {
        serialNumber: 1,
        employeeNameAr: 'محمد أحمد طه',
        employeeNameEn: 'mohamed taha',
        adminstration: 'إدارة الموارد',
        jop: 'موظف',
        PermanentType: 'دوام كلي',
        date: '12/12/2024',
      },
    ];
  }

  // onPageChange(event: PaginatorState) {
  //   this.first = event.first ?? 0;
  //   this.rows = event.rows ?? 10;
  // }
  // openDialog(): void {
  //   const dialogRef = this.dialog.open(WorkShiftsAssignmentPopupComponent as any, this.dialogSize);

  //   dialogRef.afterClosed().subscribe();
  // }

  addOrEditModel(): void {
    this.openDialog();
  }
  override openDialog(): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    const lookups = {
      usersProfiles: this.usersProfiles,
      departments: this.departments,
      shifts: this.shifts,
    };

    const viewMode = ViewModeEnum.CREATE;

    dialogConfig.data = {
      lookups: lookups,
      viewMode: viewMode,
    };

    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;

    const dialogRef = this.dialog.open(WorkShiftsAssignmentPopupComponent as any, dialogConfig);

  }
  get optionLabel(): string {
    const lang = this.langService.getCurrentLanguage();
    return lang === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }
}
