import { Component, inject, Input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { Breadcrumb } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { UserService } from '@/services/features/user.service';
import { EmployeeShiftDayService } from '@/services/features/lookups/employee-shift-day.service';
import EmployeeShiftDay from '@/models/features/lookups/work-shifts/employee-shift-day';
import { EmployeeShiftDayFilter } from '@/models/features/lookups/work-shifts/employee-shift-day-filter';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginationInfo } from '@/models/shared/response/pagination-info';
import { formatDateOnly, formatTimeRange } from '@/utils/general-helper';
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
    Select,
    DatePickerModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './shifts-view.component.html',
  styleUrl: './shifts-view.component.scss',
})
export class ShiftsViewComponent extends BaseListComponent<
  EmployeeShiftDay,
  any,
  EmployeeShiftDayService,
  EmployeeShiftDayFilter
> {
  @Input() embedded = false;

  dialogSize = { width: '100%', maxWidth: '1024px' };

  departments: BaseLookupModel[] = [];
  usersProfiles: UsersWithDepartmentLookup[] = [];

  filterOptions: EmployeeShiftDayFilter = new EmployeeShiftDayFilter();

  private shiftTypeOptions: WorkShiftTypeOption[] = WORK_SHIFT_TYPE_OPTIONS;

  employeeShiftDayService = inject(EmployeeShiftDayService);
  private departmentService = inject(DepartmentService);
  private userService = inject(UserService);

  override get filterModel(): EmployeeShiftDayFilter {
    return this.filterOptions;
  }

  override set filterModel(val: EmployeeShiftDayFilter) {
    this.filterOptions = val as EmployeeShiftDayFilter;
  }

  override get service(): EmployeeShiftDayService {
    return this.employeeShiftDayService;
  }

  override initListComponent(): void {
    const resolverData = this.activatedRoute.snapshot.data['list'];
    const initialList = resolverData?.employeeShiftDays ?? resolverData;
    this.paginationInfo = this.paginationInfo || new PaginationInfo();

    if (initialList?.list) {
      this.handleLoadListSuccess(initialList);
      this.loadLookups();
      return;
    }

    if (this.embedded) {
      this.list = [];
      this.paginationInfo.totalItems = 0;
      return;
    } else {
      this.applyTimeFormatting(this.list);
    }

    this.loadLookups();
  }

  loadEmbeddedData(): void {
    this.loadLookups();
    this.loadList().subscribe({
      next: (response) => this.handleLoadListSuccess(response),
      error: () => this.handleLoadListError(),
    });
  }

  private loadLookups(): void {
    this.departmentService.getLookup().subscribe({
      next: (data) => {
        this.departments = data.sort((a, b) =>
          this.isArabic
            ? (a.nameAr ?? '').localeCompare(b.nameAr ?? '')
            : (a.nameEn ?? '').localeCompare(b.nameEn ?? '')
        );
      },
    });

    this.userService.getUsersWithDepartment().subscribe({
      next: (data) => {
        this.usersProfiles = data.sort((a, b) =>
          this.isArabic
            ? (a.nameAr ?? '').localeCompare(b.nameAr ?? '')
            : (a.nameEn ?? '').localeCompare(b.nameEn ?? '')
        );
      },
    });
  }

  override handleLoadListSuccess(response: PaginatedList<EmployeeShiftDay>): void {
    super.handleLoadListSuccess(response);
    this.applyTimeFormatting(this.list);
  }

  private applyTimeFormatting(list: EmployeeShiftDay[]): void {
    if (!list) return;
    const locale = this.isArabic ? 'ar-EG' : 'en-US';
    list.forEach((item) => {
      item.formattedTimeRange = formatTimeRange(item.timeFrom, item.timeTo, locale);
    });
  }

  override openDialog(_model: EmployeeShiftDay): void {
    // view-only page
  }

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'SHIFTS_VIEW_PAGE.TITLE' }];
  }

  protected override mapModelToExcelRow(model: EmployeeShiftDay): { [key: string]: any } {
    return {
      [this.translateService.instant('SHIFTS_VIEW_PAGE.EMPLOYEE_NAME')]:
        this.getEmployeeName(model),
      [this.translateService.instant('SHIFTS_VIEW_PAGE.DATE_TIME')]:
        `${this.getFormattedDateRange(model.dateFrom, model.dateTo)} ${model.formattedTimeRange ?? ''}`.trim(),
      [this.translateService.instant('SHIFTS_VIEW_PAGE.SHIFT_NAME')]: this.getShiftName(model),
      [this.translateService.instant('SHIFTS_VIEW_PAGE.SHIFT_TYPE')]: this.getShiftTypeName(
        model.shiftAssignmentType
      ),
    };
  }

  protected override getPdfTitle(): { ar: string; en: string } {
    return { ar: 'ورديات الموظفين', en: 'Employee Shift Days' };
  }

  protected override getPdfExportRequest(): Observable<Blob> {
    return this.employeeShiftDayService.exportPdf(
      this.langService.getCurrentLanguage(),
      this.getPdfExportFilterOptions()
    );
  }

  get filteredUsersProfiles(): UsersWithDepartmentLookup[] {
    if (!this.filterOptions.fkDepartmentId) return this.usersProfiles;
    return this.usersProfiles.filter((u) => u.departmentId === this.filterOptions.fkDepartmentId);
  }

  onDepartmentChange(): void {
    const selected = this.usersProfiles.find((u) => u.id === this.filterOptions.fkUserProfileId);
    if (selected?.departmentId !== this.filterOptions.fkDepartmentId) {
      this.filterOptions.fkUserProfileId = undefined;
    }
  }

  get optionLabel(): string {
    return this.isArabic ? 'nameAr' : 'nameEn';
  }

  get isArabic(): boolean {
    return this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC;
  }

  getEmployeeName(item: EmployeeShiftDay): string {
    return (this.isArabic ? item.employeeName?.nameAr : item.employeeName?.nameEn) ?? '';
  }

  getShiftName(item: EmployeeShiftDay): string {
    return (this.isArabic ? item.shiftDetails?.nameAr : item.shiftDetails?.nameEn) ?? '';
  }

  getShiftTypeName(type: number): string {
    const option = this.shiftTypeOptions.find((opt) => opt.value === type);
    if (!option) return '';
    return this.isArabic ? option.nameAr : option.nameEn;
  }

  getFormattedDateRange(dateFrom: string, dateTo: string): string {
    const from = formatDateOnly(dateFrom);
    const to = formatDateOnly(dateTo);
    return from === to ? from : `${from} - ${to}`;
    // return `${from} - ${to}`;
  }

  get dateFrom(): Date | undefined {
    return this.filterOptions.dateFrom;
  }

  get dateTo(): Date | undefined {
    return this.filterOptions.dateTo;
  }
}
