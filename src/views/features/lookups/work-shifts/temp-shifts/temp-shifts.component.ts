import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { WorkDaysPopupComponent } from '../work-days-popup/work-days-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import EmployeeShifts from '@/models/features/lookups/work-shifts/employee-shifts';
import { ShiftService } from '@/services/features/lookups/shift.service';
import { CityFilter } from '@/models/features/lookups/city/city-filter';
import { EmployeeShiftsFilter } from '@/models/features/lookups/work-shifts/employee-shifts-filter';
import { PaginationInfo } from '@/models/shared/response/pagination-info';
import { PaginationParams } from '@/models/shared/pagination-params';
import { OptionsContract } from '@/contracts/options-contract';
import { MyShiftsService } from '@/services/features/lookups/my-shifts.service';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
@Component({
  selector: 'app-temp-shifts',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    DatePickerModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './temp-shifts.component.html',
  styleUrl: './temp-shifts.component.scss',
})
export default class TempShiftsComponent extends BaseListComponent<
  EmployeeShifts,
  WorkDaysPopupComponent,
  MyShiftsService,
  EmployeeShiftsFilter
> {
  // Required by BaseListComponent
  filterModel: EmployeeShiftsFilter = new EmployeeShiftsFilter();
  dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };

  filterOptions: EmployeeShiftsFilter = new EmployeeShiftsFilter();
  employeeShifts: EmployeeShifts[] = [];
  currentShift: EmployeeShifts | null = null;
  service = inject(MyShiftsService);
  languageService = inject(LanguageService);

  override initListComponent(): void {
    this.loadInitialData();
  }

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'MY_SHIFTS.MY_SHIFTS' }];
  }
  protected override mapModelToExcelRow(model: EmployeeShifts): { [key: string]: any } {
    return {
      [this.translateService.instant('MY_SHIFTS.NAME_ARABIC')]: model.nameAr || '',
      [this.translateService.instant('MY_SHIFTS.NAME_ENGLISH')]: model.nameEn || '',
      [this.translateService.instant('MY_SHIFTS.START_DATE')]: this.formatDate(model.startDate),
      [this.translateService.instant('MY_SHIFTS.END_DATE')]: this.formatDate(model.endDate),
      [this.translateService.instant('MY_SHIFTS.TIME_FROM_TO')]:
        `${model.timeFrom} - ${model.timeTo}`,
      [this.translateService.instant('MY_SHIFTS.ATTENDANCE_BUFFER')]: model.attendanceBuffer ?? '',
      [this.translateService.instant('MY_SHIFTS.LEAVE_BUFFER')]: model.leaveBuffer ?? '',
    };
  }

  openDialog(shift: EmployeeShifts): void {
    const viewMode = ViewModeEnum.EDIT;
    this.openBaseDialog(WorkDaysPopupComponent as any, shift, viewMode);
  }

  private loadInitialData(): void {
    const resolverData = this.activatedRoute.snapshot.data['list'];

    if (resolverData) {
      // Load shifts data
      if (resolverData.myShifts) {
        this.employeeShifts = resolverData.myShifts.list || [];
        this.list = this.employeeShifts; // Update base class list

        // Safely handle pagination info
        if (resolverData.myShifts.paginationInfo) {
          this.paginationInfo = {
            ...new PaginationInfo(),
            ...resolverData.myShifts.paginationInfo,
            totalItems: resolverData.myShifts.paginationInfo.totalItems || 0,
          };
        } else {
          // Initialize with default values if no pagination info
          this.paginationInfo = new PaginationInfo();
          this.paginationInfo.totalItems = this.employeeShifts.length;
          this.paginationInfo.currentPage = 1;
          this.paginationInfo.pageSize = 10;
          this.paginationInfo.totalPages = Math.ceil(this.employeeShifts.length / 10);
        }
      }

      // Load current shift data
      this.currentShift = resolverData.currentShift || null;
    } else {
      // Initialize with empty data if resolver failed
      this.employeeShifts = [];
      this.list = [];
      this.currentShift = null;
      this.paginationInfo = new PaginationInfo();
      this.paginationInfo.totalItems = 0;
    }
  }

  // Current shift display methods
  getCurrentShiftTimeRange(): string {
    return `${this.currentShift?.timeFrom} - ${this.currentShift?.timeTo}`;
  }

  getCurrentShiftName(): string {
    return this.langService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.currentShift?.nameEn as string)
      : (this.currentShift?.nameAr as string);
  }

  // Utility methods
  formatTime(time?: number): number {
    return time || 0;
  }

  formatDate(date?: Date | string): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-GB');
  }

  getTimeRange(shift: EmployeeShifts): string {
    return `${shift.timeFrom} - ${shift.timeTo}`;
  }

  getBufferTime(minutes?: number): string {
    return minutes?.toString() || '0';
  }

  // Search functionality - override base class method
  override search(isStoredProcedure: boolean = false): void {
    this.first = 0;
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = this.rows;

    // Sync filter options
    this.syncFilters();

    const filterOptions = this.convertFilterToOptions(this.filterModel);

    this.service.getMyShifts(this.paginationParams, filterOptions).subscribe({
      next: (response) => {
        this.handleSearchSuccess(response);
      },
      error: (error) => {
        this.handleLoadListError();
      },
    });
  }
  override resetSearch(isStoredProcedure: boolean = false): void {
    this.filterModel = new EmployeeShiftsFilter();
    this.filterOptions = new EmployeeShiftsFilter();
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.loadShifts();
  }

  // Custom reset method for template
  onResetFilters(): void {
    this.resetSearch();
  }

  // Custom search method for template
  onSearch(): void {
    this.syncFilters();
    this.search();
  }

  // Page change - override base class method
  override onPageChange(event: PaginatorState, isStoredProcedure: boolean = false): void {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    this.loadShifts(this.paginationParams.pageNumber);
  }

  private loadShifts(page: number = 1): void {
    this.paginationParams.pageNumber = page;
    this.paginationParams.pageSize = this.rows;

    // Update filter dates

    const filterOptions = this.convertFilterToOptions(this.filterModel);

    this.service.getMyShifts(this.paginationParams, filterOptions).subscribe({
      next: (response) => {
        this.handleLoadSuccess(response);
      },
      error: (error) => {
        this.handleLoadListError();
      },
    });
  }

  // Handle successful responses
  private handleSearchSuccess(response: any): void {
    this.employeeShifts = response.list || [];
    this.list = this.employeeShifts;
    this.updatePaginationInfo(response);
  }

  private handleLoadSuccess(response: any): void {
    this.employeeShifts = response.list || [];
    this.list = this.employeeShifts;
    this.updatePaginationInfo(response);
  }

  private updatePaginationInfo(response: any): void {
    if (response.paginationInfo) {
      this.paginationInfo = {
        ...new PaginationInfo(),
        ...response.paginationInfo,
        totalItems: response.paginationInfo.totalItems || 0,
      };
    } else {
      this.paginationInfo.totalItems = this.employeeShifts.length;
    }
  }

  // Sync between template filters and model filters
  private syncFilters(): void {
    this.filterModel.nameAr = this.filterOptions.nameAr;
    this.filterModel.nameEn = this.filterOptions.nameEn;
    this.filterModel.startDate = this.filterOptions.startDate;
    this.filterModel.endDate = this.filterOptions.endDate;
  }

  // Convert filter to options contract
  private convertFilterToOptions(filter: EmployeeShiftsFilter): OptionsContract {
    const options: OptionsContract = {};

    if (filter.nameAr) options['nameAr'] = filter.nameAr;
    if (filter.nameEn) options['nameEn'] = filter.nameEn;
    if (filter.startDate) options['startDate'] = filter.startDate;
    if (filter.endDate) options['endDate'] = filter.endDate;

    return options;
  }

  // Additional utility methods
  getTotalRecords(): number {
    return this.paginationInfo?.totalItems || 0;
  }

  hasCurrentShift(): boolean {
    return this.currentShift !== null;
  }

  hasShifts(): boolean {
    return this.employeeShifts.length > 0;
  }

  isCurrentLanguageEnglish(): boolean {
    return this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH;
  }

  onExportExcel(): void {
    this.exportExcel('my-shifts.xlsx');
  }
}
