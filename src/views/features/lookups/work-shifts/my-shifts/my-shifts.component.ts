import { WorkShiftType } from '@/enums/work-shift-type';
import { MultiSelect } from 'primeng/multiselect';
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
import EmployeeShift from '@/models/features/lookups/work-shifts/employee-shift';
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
import { CustomValidators } from '@/validators/custom-validators';
import * as XLSX from 'xlsx';
import {
  changeTimeSuffix,
  convertUtcToSystemTimeZone,
  dateToTimeString,
  formatDateTo12Hour,
  formatTimeTo12Hour,
  timeStringToDate,
  toDateOnly,
} from '@/utils/general-helper';
import { WorkDaysSetting } from '@/models/features/setting/work-days-setting';
import { getShiftTypeTranslation, isShiftWorkingDay } from '@/utils/shift-helper';
import {
  WORK_SHIFT_TYPE_OPTIONS,
  WorkShiftTypeOption,
} from '@/models/features/lookups/work-shifts/work-shift-type-option';
import { SelectModule } from 'primeng/select';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { registerIBMPlexArabicFont } from '../../../../../../public/assets/fonts/ibm-plex-font';
@Component({
  selector: 'app-my-shifts',
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
    SelectModule,
  ],
  templateUrl: './my-shifts.component.html',
  styleUrl: './my-shifts.component.scss',
})
export default class MyShiftsComponent extends BaseListComponent<
  EmployeeShift,
  WorkDaysPopupComponent,
  MyShiftsService,
  EmployeeShiftsFilter
> {
  // Required by BaseListComponent
  filterModel: EmployeeShiftsFilter = new EmployeeShiftsFilter();
  dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };
  WorkShiftType = WorkShiftType;
  filterOptions: EmployeeShiftsFilter = new EmployeeShiftsFilter();
  defaultWorkDays: WorkDaysSetting = new WorkDaysSetting();
  employeeShifts: EmployeeShift[] = [];
  currentShift: EmployeeShift | null = null;
  service = inject(MyShiftsService);
  languageService = inject(LanguageService);
  locale: 'en-US' | 'ar-EG' = 'en-US';
  shiftTypeOptions: WorkShiftTypeOption[] = WORK_SHIFT_TYPE_OPTIONS;
  override initListComponent(): void {
    this.locale = this.isCurrentLanguageEnglish() ? 'en-US' : 'ar-EG';
    this.loadInitialData();

    if (this.currentShift?.timeTo) {
      this.currentShift.timeTo = dateToTimeString(
        convertUtcToSystemTimeZone(timeStringToDate(this.currentShift.timeTo))
      ) as string;
    }
    if (this.currentShift?.timeFrom) {
      this.currentShift.timeFrom = dateToTimeString(
        convertUtcToSystemTimeZone(timeStringToDate(this.currentShift.timeFrom))
      ) as string;
    }

    this.languageService.languageChanged$.subscribe(() => {
      this.locale = this.isCurrentLanguageEnglish() ? 'en-US' : 'ar-EG';
      // Format multiple shifts
      this.employeeShifts?.forEach((shift) => {
        changeTimeSuffix(
          this.isCurrentLanguageEnglish.bind(this),
          shift,
          'timeFrom',
          'formattedTimeFrom'
        );
        changeTimeSuffix(
          this.isCurrentLanguageEnglish.bind(this),
          shift,
          'timeTo',
          'formattedTimeTo'
        );
      });

      // Format current shift
      if (this.currentShift) {
        changeTimeSuffix(
          this.isCurrentLanguageEnglish.bind(this),
          this.currentShift,
          'timeFrom',
          'formattedTimeFrom'
        );
        changeTimeSuffix(
          this.isCurrentLanguageEnglish.bind(this),
          this.currentShift,
          'timeTo',
          'formattedTimeTo'
        );
      }
    });
  }

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'MY_SHIFTS.MY_SHIFTS' }];
  }
  protected override mapModelToExcelRow(model: EmployeeShift): { [key: string]: any } {
    // Ensure formatted times are set
    if (!model.formattedTimeFrom) {
      changeTimeSuffix(
        this.isCurrentLanguageEnglish.bind(this),
        model,
        'timeFrom',
        'formattedTimeFrom'
      );
    }
    if (!model.formattedTimeTo) {
      changeTimeSuffix(
        this.isCurrentLanguageEnglish.bind(this),
        model,
        'timeTo',
        'formattedTimeTo'
      );
    }

    return {
      [this.translateService.instant('MY_SHIFTS.NAME_ARABIC')]: model.nameAr || '',
      [this.translateService.instant('USER_WORK_SHIFT_PAGE.SHIFT_TYPE')]:
        this.getShiftTypeName(model),
      [this.translateService.instant('MY_SHIFTS.NAME_ENGLISH')]: model.nameEn || '',
      [this.translateService.instant('MY_SHIFTS.START_DATE')]: model.startDate,
      [this.translateService.instant('MY_SHIFTS.END_DATE')]: model.endDate,
      [this.translateService.instant('MY_SHIFTS.TIME_FROM_TO')]:
        `${model.formattedTimeFrom} - ${model.formattedTimeTo}`,
      [this.translateService.instant('MY_SHIFTS.ATTENDANCE_BUFFER')]: model.attendanceBuffer ?? '',
      [this.translateService.instant('MY_SHIFTS.LEAVE_BUFFER')]: model.leaveBuffer ?? '',
    };
  }

  openDialog(shift: EmployeeShift): void {
    const viewMode = ViewModeEnum.EDIT;
    const lookups = {
      defaultWorkDays: [this.defaultWorkDays],
    };
    this.openBaseDialog(WorkDaysPopupComponent as any, shift, viewMode, lookups);
  }

  private loadInitialData(): void {
    const resolverData = this.activatedRoute.snapshot.data['list'];

    this.employeeShifts = resolverData.myShifts.list || [];
    this.list = this.employeeShifts; // Update base class list
    this.paginationInfo = {
      ...new PaginationInfo(),
      ...resolverData.myShifts.paginationInfo,
      totalItems: resolverData.myShifts.paginationInfo.totalItems || 0,
    };
    this.defaultWorkDays = resolverData.defaultworkDays;
    // Load current shift data
    this.currentShift = resolverData.currentShift || null;
  }

  getCurrentShiftName(): string {
    return this.langService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (this.currentShift?.nameEn as string)
      : (this.currentShift?.nameAr as string);
  }

  override search(isStoredProcedure: boolean = false): void {
    this.appliedFilterModel = { ...this.filterModel };
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
    this.appliedFilterModel = new EmployeeShiftsFilter();
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
        this.handleSearchSuccess(response);
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

    this.convertTimeFormatToTwelve();
    this.updatePaginationInfo(response);
  }

  convertTimeFormatToTwelve() {
    this.employeeShifts?.forEach((shift) => {
      changeTimeSuffix(
        this.isCurrentLanguageEnglish.bind(this),
        shift,
        'timeFrom',
        'formattedTimeFrom'
      );
      changeTimeSuffix(
        this.isCurrentLanguageEnglish.bind(this),
        shift,
        'timeTo',
        'formattedTimeTo'
      );
    });
  }

  formatPresenceTime(shift: EmployeeShift | null) {
    const locale = this.isCurrentLanguageEnglish() ? 'en-US' : 'ar-EG';
    return formatTimeTo12Hour(shift?.presenceInquiryTime || '', locale);
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
    this.filterModel.workShiftType = this.filterOptions.workShiftType;
  }

  // Convert filter to options contract
  private convertFilterToOptions(filter: EmployeeShiftsFilter): OptionsContract {
    const options: OptionsContract = {};

    if (filter.nameAr) options['nameAr'] = filter.nameAr;
    if (filter.nameEn) options['nameEn'] = filter.nameEn;
    if (filter.startDate) options['startDate'] = filter.startDate;
    if (filter.endDate) options['endDate'] = filter.endDate;
    if (filter.workShiftType) options['workShiftType'] = filter.workShiftType;

    return options;
  }

  // Additional utility methods
  getTotalRecords(): number {
    return this.paginationInfo?.totalItems || 0;
  }

  isCurrentLanguageEnglish(): boolean {
    return this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH;
  }

  onExportExcel(): void {
    this.exportExcel('my-shifts.xlsx');
  }

  override exportExcel(fileName: string = 'my-shifts.xlsx', isStoredProcedure?: boolean): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
    };

    const fetchAll = this.service.getMyShifts(allDataParams, { ...this.appliedFilterModel! });

    fetchAll.subscribe({
      next: (response) => {
        const fullList = response.list || [];
        if (fullList.length === 0) {
          this.alertsService.showErrorMessage({ messages: ['COMMON.NO_DATA_TO_EXPORT'] });
          return;
        } else {
          const isRTL = this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC;
          const transformedData = fullList.map((item) => this.mapModelToExcelRow(item));
          const ws = XLSX.utils.json_to_sheet(transformedData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          wb.Workbook = { Views: [{ RTL: isRTL }] };
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, fileName);
        }
      },
      error: (_) => {
        this.alertsService.showErrorMessage({ messages: ['COMMON.ERROR'] });
      },
    });
  }
  override exportPdf(
    fileName: string = this.translateService.instant('MY_SHIFTS.MY_SHIFTS') + '.pdf'
  ): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
    };

    const fetchAll = this.service.getMyShifts(allDataParams, { ...this.appliedFilterModel! });
    const isRTL = this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC;

    fetchAll.subscribe({
      next: (response) => {
        const fullList = response.list || [];
        if (fullList.length === 0) {
          this.alertsService.showErrorMessage({ messages: ['COMMON.NO_DATA_TO_EXPORT'] });
          return;
        }

        const transformedData = fullList.map((item) => this.mapModelToPdfRow(item));
        const headers = Object.keys(transformedData[0]);
        const titles = this.getPdfTitle();
        const title = isRTL ? titles.ar : titles.en;

        // ── Build HTML table ───────────────────────────────────────
        const container = document.createElement('div');
        container.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 1122px;
        background: white;
        padding: 20px;
        font-family: 'IBM Plex Sans Arabic', Arial, sans-serif;
        direction: ${isRTL ? 'rtl' : 'ltr'};
      `;

        const displayHeaders = isRTL ? [...headers].reverse() : headers;

        container.innerHTML = `
        <div style="
          color: #2d9c9c;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 8px;
          text-align: ${isRTL ? 'right' : 'left'};
          font-family: 'IBM Plex Sans Arabic', Arial, sans-serif;
        ">${title}</div>
        <div style="height: 2px; background: #2d9c9c; margin-bottom: 12px;"></div>
        <table style="
          width: 100%;
          border-collapse: collapse;
          font-family: 'IBM Plex Sans Arabic', Arial, sans-serif;
          font-size: 11px;
          direction: ${isRTL ? 'rtl' : 'ltr'};
          border: 1px solid #e2e8f0;
        ">
          <thead>
            <tr>
              ${displayHeaders
                .map(
                  (h) => `
                <th style="
                  background: #f3f4f6;
                  color: #33415a;
                  padding: 8px 6px;
                  text-align: center;
                  border: 1px solid #e2e8f0;
                  font-weight: normal;
                  white-space: nowrap;
                ">${h}</th>
              `
                )
                .join('')}
            </tr>
          </thead>
          <tbody>
            ${transformedData
              .map((row, i) => {
                const values = isRTL ? [...Object.values(row)].reverse() : Object.values(row);
                return `
                <tr style="background: #ffffff;">
                  ${values
                    .map(
                      (val) => `
                    <td style="
                      padding: 7px 6px;
                      text-align: center;
                      border-bottom: 1px solid #e2e8f0;
                      color: #333333;
                      white-space: nowrap;
                    ">${val != null ? val : ''}</td>
                  `
                    )
                    .join('')}
                </tr>
              `;
              })
              .join('')}
          </tbody>
        </table>
      `;

        document.body.appendChild(container);

        // ── Render to PDF ──────────────────────────────────────────
        import('html2canvas').then(({ default: html2canvas }) => {
          html2canvas(container, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            width: 1122,
            windowWidth: 1122,
          })
            .then((canvas) => {
              document.body.removeChild(container);

              const imgData = canvas.toDataURL('image/png');
              const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });

              const pageWidth = doc.internal.pageSize.getWidth();
              const pageHeight = doc.internal.pageSize.getHeight();

              const imgWidth = pageWidth - 20;
              const imgHeight = (canvas.height * imgWidth) / canvas.width;

              // Handle multi-page
              let heightLeft = imgHeight;
              let position = 10;

              doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
              heightLeft -= pageHeight - 20;

              while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight - 20;
              }

              doc.save(fileName);
            })
            .catch(() => {
              document.body.removeChild(container);
              this.alertsService.showErrorMessage({ messages: ['COMMON.ERROR'] });
            });
        });
      },

      error: (_) => {
        this.alertsService.showErrorMessage({ messages: ['COMMON.ERROR'] });
      },
    });
  }
  get startDate() {
    return this.filterOptions.startDate as Date;
  }

  get endDate() {
    return this.filterOptions.endDate as Date;
  }
  get isTodayWorkingDay(): boolean {
    if (!this.currentShift) return true;

    return isShiftWorkingDay(
      this.currentShift.workShiftType,
      this.currentShift.startDate,
      new Date(),
      this.currentShift.employeeWorkingDays,
      this.defaultWorkDays as any
    );
  }

  getShiftTypeName(shift?: EmployeeShift | null): string {
    const shiftModel = shift || this.currentShift;
    return getShiftTypeTranslation(shiftModel?.workShiftType, this.translateService);
  }

  get optionLabel(): string {
    const lang = this.langService.getCurrentLanguage();
    return lang === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }
}
