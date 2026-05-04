import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { Breadcrumb } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import UserWorkShift from '@/models/features/lookups/work-shifts/user-work-shifts';
import { UserWorkShiftService } from '@/services/features/lookups/user-workshift.service';
import UserWorkShiftsFilter from '@/models/features/lookups/work-shifts/user-work-shifts-filter';
import {
  WORK_SHIFT_TYPE_OPTIONS,
  WorkShiftTypeOption,
} from '@/models/features/lookups/work-shifts/work-shift-type-option';

@Component({
  selector: 'app-shifts-view',
  imports: [
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    PaginatorModule,
    Breadcrumb,
    MultiSelect,
    DatePickerModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './shifts-view.component.html',
  styleUrl: './shifts-view.component.scss',
})
export class ShiftsViewComponent extends BaseListComponent<
  UserWorkShift,
  any,
  UserWorkShiftService,
  UserWorkShiftsFilter
> {
  dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };

  usersProfiles: UsersWithDepartmentLookup[] = [];
  departments: BaseLookupModel[] = [];
  filterOptions: UserWorkShiftsFilter = new UserWorkShiftsFilter();
  shiftTypeOptions: WorkShiftTypeOption[] = WORK_SHIFT_TYPE_OPTIONS;

  userWorkShiftService = inject(UserWorkShiftService);

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
    // Static Arabic data mimicking the screenshot
    this.list = [
      {
        employeeNameAr: 'أيمن أحمد طارق',
        startDate: '12/05/2024',
        startTime: '08:00',
        endTime: '07:00',
        shiftNameAr: 'وردية عمل',
        shiftTypeName: 'وردية بنظام الراحات 24 س / عمل',
      },
      {
        employeeNameAr: 'محمود محمد عادل',
        startDate: '12/05/2024',
        startTime: '08:00',
        endTime: '07:00',
        shiftNameAr: 'وردية عمل',
        shiftTypeName: 'وردية بنظام الراحات 24 س / عمل',
      },
      {
        employeeNameAr: 'محمود محمد عادل',
        startDate: '12/05/2024',
        startTime: '08:00',
        endTime: '07:00',
        shiftNameAr: 'وردية عمل',
        shiftTypeName: 'وردية بنظام الراحات 24 س / راحة',
      },
      {
        employeeNameAr: 'أيمن أحمد طارق',
        startDate: '12/05/2024',
        startTime: '08:00',
        endTime: '07:00',
        shiftNameAr: 'وردية عمل',
        shiftTypeName: 'وردية متناوبة / راحة',
      },
      {
        employeeNameAr: 'محمود محمد عادل',
        startDate: '12/05/2024',
        startTime: '08:00',
        endTime: '07:00',
        shiftNameAr: 'وردية عمل',
        shiftTypeName: 'وردية بنظام ساعات العمل المعتمدة',
      },
    ] as any[];

    this.paginationInfo = { totalItems: 5 } as any;

    const data = this.activatedRoute.snapshot.data['list'];
    if (data) {
      this.usersProfiles = data.users ?? [];
      this.departments = data.departments ?? [];
      this.departments = this.sortByName(this.departments, this.optionLabel);
      this.usersProfiles = this.sortByName(this.usersProfiles, this.optionLabel);
    }
  }

  private sortByName<T extends { [key: string]: any }>(arr: T[], key: string): T[] {
    return [...arr].sort((a, b) => {
      const nameA = (a[key] || '').toString().toLowerCase();
      const nameB = (b[key] || '').toString().toLowerCase();
      return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
    });
  }

  protected override mapModelToExcelRow(model: UserWorkShift): { [key: string]: any } {
    return {
      [this.translateService.instant('USER_WORK_SHIFT_PAGE.EMPLOYEE_NAME')]:
        this.currentLang === 'ar' ? (model as any).employeeNameAr : (model as any).employeeNameEn,
      [this.translateService.instant('USER_WORK_SHIFT_PAGE.SHIFT_NAME_AR')]: model.shiftNameAr,
      [this.translateService.instant('USER_WORK_SHIFT_PAGE.SHIFT_NAME_EN')]: model.shiftNameEn,
      [this.translateService.instant('USER_WORK_SHIFT_PAGE.SHIFT_TYPE')]: this.getShiftTypeName(
        model.workShiftType
      ),
      [this.translateService.instant('USER_WORK_SHIFT_PAGE.START_DATE')]: model.startDate,
      [this.translateService.instant('USER_WORK_SHIFT_PAGE.END_DATE')]: model.endDate,
    };
  }

  protected override getBreadcrumbKeys() {
    return [{ labelKey: ' ورديات الموظفين' }];
  }

  override openDialog(_model: UserWorkShift): void {
    // View-only page — no dialog
  }

  get optionLabel(): string {
    return this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }

  get currentLang(): string {
    return this.langService.getCurrentLanguage();
  }

  get startDate(): Date {
    return this.filterOptions.startDate as Date;
  }

  get endDate(): Date {
    return this.filterOptions.endDate as Date;
  }

  getShiftTypeName(type: number): string {
    const option = this.shiftTypeOptions.find((opt) => opt.value === type);
    return option
      ? this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC
        ? option.nameAr
        : option.nameEn
      : '';
  }

  override resetSearch(): void {
    this.filterModel = {} as UserWorkShiftsFilter;
    this.appliedFilterModel = {} as UserWorkShiftsFilter;
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.loadList().subscribe({
      next: (response) => this.handleLoadListSuccess(response),
      error: this.handleLoadListError,
    });
  }
}
