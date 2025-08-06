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
  filterModel: EmployeeShiftsFilter = new EmployeeShiftsFilter();
  override initListComponent(): void {
  }
  protected override getBreadcrumbKeys(): { labelKey: string; icon?: string; routerLink?: string; }[] {
    return [{ labelKey: 'WORK_SHIFTS.WORK_SHIFTS' }];
  }
  protected override mapModelToExcelRow(model: EmployeeShifts): { [key: string]: any; } {
    throw new Error('Method not implemented.');
  }

  filterOptions: EmployeeShiftsFilter = new EmployeeShiftsFilter();
  startDate: Date | undefined;
  endDate: Date | undefined;

  employeeShifts: EmployeeShifts[] = [];
  currentShift: EmployeeShifts = new EmployeeShifts();
  dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };

  isLoading: boolean = false;
  isSearching: boolean = false;

  private dialog = inject(MatDialog);
  service = inject(MyShiftsService);
  languageService = inject(LanguageService);

  private initializeBreadcrumbs(): void {
    this.breadcrumbs = [
      { label: 'لوحة المعلومات' },
      { label: 'وردياتي' }
    ];
  }

  private loadInitialData(): void {
    const resolverData = this.activatedRoute.snapshot.data['list'];
    if (resolverData) {
      if (resolverData.myShifts) {
        this.employeeShifts = resolverData.myShifts.list || [];
        this.paginationInfo = resolverData.myShifts.paginationInfo || new PaginationInfo();
      }
      this.currentShift = resolverData.currentShift || null;
    }
  }

  getCurrentShiftTimeRange(): string {
    if (this.currentShift?.timeFrom && this.currentShift?.timeTo) {
      return `${this.currentShift.timeFrom} - ${this.currentShift.timeTo}`;
    }
    return '--:-- - --:--';
  }

  getCurrentShiftName(): string {
    return this.currentShift?.nameAr || 'اسم الوردية الحالية';
  }

  formatTime(time?: number): number {
    return time || 0;
  }

  formatDate(date?: Date | string): string {
    if (!date) return '--/--/----';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-GB');
  }

  getTimeRange(shift: EmployeeShifts): string {
    return shift.timeFrom && shift.timeTo ? `${shift.timeFrom} - ${shift.timeTo}` : '--:-- - --:--';
  }

  onSearch(): void {
    if (this.isSearching) return;
    this.isSearching = true;
    this.first = 0;

    const paginationParams = new PaginationParams();
    paginationParams.pageNumber = 1;
    paginationParams.pageSize = this.rows;

    this.filterOptions.startDate = this.startDate as Date;
    this.filterOptions.endDate = this.endDate as Date;

    this.service.getMyShifts(paginationParams, this.convertFilterToOptions(this.filterOptions))
      .subscribe({
        next: (response) => {
          this.employeeShifts = response.list || [];
          this.paginationInfo = {
            ...new PaginationInfo(),
            ...response.paginationInfo,
            totalItems: response.paginationInfo?.totalItems ?? 0
          };
          this.isSearching = false;
        },
        error: (error) => {
          console.error('Error searching shifts:', error);
          this.isSearching = false;
        }
      });
  }

  onResetFilters(): void {
    this.filterOptions = new EmployeeShiftsFilter();
    this.startDate = undefined;
    this.endDate = undefined;
    this.loadShifts();
  }

  private loadShifts(page: number = 1): void {
    if (this.isLoading) return;
    this.isLoading = true;

    const paginationParams = new PaginationParams();
    paginationParams.pageNumber = page;
    paginationParams.pageSize = this.rows;

    this.filterOptions.startDate = this.startDate as Date;
    this.filterOptions.endDate = this.endDate as Date;

    this.service.getMyShifts(paginationParams, this.convertFilterToOptions(this.filterOptions))
      .subscribe({
        next: (response) => {
          this.employeeShifts = response.list || [];
          this.paginationInfo = {
            ...new PaginationInfo(),
            ...response.paginationInfo,
            totalItems: response.paginationInfo?.totalItems ?? 0
          };
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading shifts:', error);
          this.isLoading = false;
        }
      });
  }

  openDialog(shift: EmployeeShifts): void {
    const viewMode = ViewModeEnum.EDIT;
    this.openBaseDialog(WorkDaysPopupComponent as any, shift, viewMode);
  }

  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }

  onExportExcel(): void {
    console.log('Exporting to Excel...');
  }


  // getTotalRecords(): number {
  //   return this.paginationInfo.totalItems || 0;
  // }

  hasCurrentShift(): boolean {
    return this.currentShift !== null;
  }

  hasShifts(): boolean {
    return this.employeeShifts.length > 0;
  }

  getBufferTime(minutes?: number): string {
    return minutes?.toString() || '30';
  }

  private convertFilterToOptions(filter: EmployeeShiftsFilter): OptionsContract {
    const options: OptionsContract = {};

    if (filter.nameAr) options['nameAr'] = filter.nameAr;
    if (filter.nameEn) options['nameEn'] = filter.nameEn;
    if (filter.startDate) options['startDate'] = filter.startDate;
    if (filter.endDate) options['endDate'] = filter.endDate;

    return options;
  }
}
