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
    fileName: string = this.translateService.instant(
      'MY_PRESENCE_INQUIRIES_PAGE.MY_PRESENCE_INQUIRIES'
    ) + '.pdf'
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

        const formatCell = (val: any): string | number => {
          if (val instanceof Date) return val.toLocaleString();
          return val != null ? val : '';
        };

        const rawHead = Object.keys(transformedData[0]);
        const head = isRTL ? [[...rawHead].reverse()] : [rawHead];
        const body = transformedData.map((row) => {
          const values = Object.values(row).map(formatCell);
          return isRTL ? [...values].reverse() : values;
        });

        const HEADER_BG: [number, number, number] = [243, 244, 246];
        const HEADER_TEXT: [number, number, number] = [51, 65, 85];
        const ROW: [number, number, number] = [255, 255, 255];
        const HEADER_BORDER_COLOR: [number, number, number] = [226, 232, 240];
        const BODY_TEXT: [number, number, number] = [51, 51, 51];

        const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });
        registerIBMPlexArabicFont(doc);

        const pageWidth = doc.internal.pageSize.getWidth();
        const colCount = head[0].length;
        const usableW = pageWidth - 20;
        const colWidth = usableW / colCount;

        const columnStyles: { [key: number]: any } = {};
        for (let i = 0; i < colCount; i++) {
          columnStyles[i] = { cellWidth: colWidth, halign: 'center', valign: 'middle' };
        }

        const titles = this.getPdfTitle();

        autoTable(doc, {
          head,
          body,
          styles: {
            font: 'IBMPlexSansArabic',
            fontStyle: 'normal',
            fontSize: 9,
            halign: 'center',
            valign: 'middle',
            textColor: BODY_TEXT,
            lineWidth: 0,
            cellPadding: 4,
          },
          headStyles: {
            font: 'IBMPlexSansArabic',
            fontStyle: 'normal',
            fontSize: 9,
            halign: 'center',
            valign: 'middle',
            fillColor: HEADER_BG,
            textColor: HEADER_TEXT,
            lineColor: HEADER_BORDER_COLOR,
            lineWidth: 0.25,
            cellPadding: 5,
            minCellHeight: 12,
          },
          bodyStyles: { fillColor: ROW },
          alternateRowStyles: { fillColor: ROW },
          margin: { top: 18, right: 10, bottom: 10, left: 10 },
          columnStyles,
          tableWidth: 'auto',

          didParseCell: (data) => {
            if (data.section === 'body') {
              // bottom border only on body cells
              data.cell.styles.lineWidth = { top: 0, right: 0, bottom: 0.3, left: 0 } as any;
              data.cell.styles.lineColor = [226, 232, 240] as any;
            } else if (data.section === 'head') {
              // full border on header cells
              data.cell.styles.lineWidth = 0.25;
              data.cell.styles.lineColor = [226, 232, 240] as any;
            }
          },

          didDrawPage: (data) => {
            const title = isRTL ? titles.ar : titles.en;
            doc.setFont('IBMPlexSansArabic');
            doc.setFontSize(11);
            doc.setTextColor(45, 156, 156);
            if (isRTL) {
              doc.text(title, pageWidth - 10, 12, { align: 'right' });
            } else {
              doc.text(title, 10, 12, { align: 'left' });
            }
            doc.setDrawColor(45, 156, 156);
            doc.setLineWidth(0.5);
            doc.line(10, 14, pageWidth - 10, 14);
          },
        });

        // ── Outer border using lastAutoTable ────────────────────────────────
        const last = (doc as any).lastAutoTable;

        if (last) {
          const marginLeft = (last.settings?.margin?.left ?? 10) as number;
          const marginRight = (last.settings?.margin?.right ?? 10) as number;
          const startY = (last.startY ?? last.settings?.margin?.top ?? 18) as number;
          const finalY = (last.finalY ?? startY) as number;
          const tableW = pageWidth - marginLeft - marginRight;
          const tableH = finalY - startY;

          if (tableW > 0 && tableH > 0) {
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.4);
            doc.rect(marginLeft, startY, tableW, tableH);
          }
        }

        doc.save(fileName);
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
