import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmationService } from '@/services/shared/confirmation.service';
import { AttendanceLogPopupComponent } from '../attendance-log-popup/attendance-log-popup.component';
import { AttendanceService } from '@/services/features/attendance-log.service';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { InputTextModule } from 'primeng/inputtext';
import { LanguageService } from '@/services/shared/language.service';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { UserService } from '@/services/features/user.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { AttendanceLog } from '@/models/features/attendance/attendance-log/attendance-log';
import { BooleanOptionModel } from '@/models/shared/boolean-option';
import { PROCESSING_STATUS_OPTIONS } from '@/models/shared/processing-status-option';
import { MyAttendanceLogFilter } from '@/models/features/attendance/attendance-log/my-attendance-log-filter';
import { CustomValidators } from '@/validators/custom-validators';
import * as XLSX from 'xlsx';
import { formatSwipeTime } from '@/utils/general-helper';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { registerIBMPlexArabicFont } from '../../../../../public/assets/fonts/ibm-plex-font';

@Component({
  selector: 'app-my-attendance-log-list',
  imports: [
    FormsModule,
    Select,
    DatePickerModule,
    FluidModule,
    TableModule,
    CommonModule,
    RouterModule,
    SplitButtonModule,
    PaginatorModule,
    TranslatePipe,
    InputTextModule,
  ],
  templateUrl: './my-attendance-log-list.component.html',
  styleUrl: './my-attendance-log-list.component.scss',
  providers: [MessageService],
})
export default class MyAttendanceLogListComponent
  extends BaseListComponent<
    AttendanceLog,
    AttendanceLogPopupComponent,
    AttendanceService,
    MyAttendanceLogFilter
  >
  implements OnInit, OnChanges
{
  @Input() isActive: boolean = false;
  @Input() creators: BaseLookupModel[] = [];
  private hasInitialized: boolean = false;

  languageService = inject(LanguageService);
  departmentService = inject(DepartmentService);
  userService = inject(UserService);
  attendanceService = inject(AttendanceService);

  actionList: MenuItem[] = [];
  channels: BaseLookupModel[] = [];

  filterModel: MyAttendanceLogFilter = new MyAttendanceLogFilter();
  processingStatusOptions: BooleanOptionModel[] = PROCESSING_STATUS_OPTIONS;

  confirmationService = inject(ConfirmationService);

  override dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };

  override get service() {
    return this.attendanceService;
  }

  get optionLabel(): string {
    const lang = this.languageService.getCurrentLanguage();
    return lang === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }

  override loadListSP() {
    return this.service.loadMyAttendanceLogPaginatedSP(this.paginationParams, {
      ...this.appliedFilterModel!,
    });
  }

  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }

  override initListComponent(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isActive']) {
      const current = changes['isActive'].currentValue;
      const previous = changes['isActive'].previousValue;

      // Skip first trigger after component init
      if (!this.hasInitialized) {
        this.hasInitialized = true;
        return;
      }

      // Only load data if tab is active and this is not the initial change
      if (current === true && previous === false) {
        this.filterModel = {} as MyAttendanceLogFilter;
        this.appliedFilterModel = {} as MyAttendanceLogFilter;
        this.loadDataIfNeeded();
      }
    }
  }

  private loadDataIfNeeded(): void {
    // Load data when tab becomes active
    this.loadListSP().subscribe({
      next: (response) => this.handleLoadListSuccess(response),
      error: this.handleLoadListError,
    });
  }

  protected override getBreadcrumbKeys() {
    return [];
  }

  override openDialog(attendanceLog?: AttendanceLog): void {
    throw new Error('Method not implemented.');
  }

  onCreatorChange(creatorId: number | undefined) {
    this.filterModel.creatorId = creatorId ?? undefined;
  }

  onChannelChange(channelName: string | undefined) {
    this.filterModel.channelName = channelName ?? undefined;
  }

  formatSwipeTimeArEn(swipeTime: string | Date | undefined): { date: string; time: string } {
    if (!swipeTime) return { date: '', time: '' };
    const locale = this.isCurrentLanguageEnglish() ? 'en-US' : 'ar-EG';
    const { date, time } = formatSwipeTime(swipeTime.toString(), locale);
    return { date, time };
  }

  swipeTimeArEn(swipeTime: string | Date | undefined): string {
    const { date, time } = this.formatSwipeTimeArEn(swipeTime);
    return `${date} ${time}`;
  }

  getProcessingStatusClass(isProcessed: boolean): string {
    return isProcessed ? 'bg-[#ecfdf3] text-[#085d3a]' : 'bg-[#fffaeb] text-[#93370d]';
  }

  getProcessingStatusDotClass(isProcessed: boolean): string {
    return isProcessed ? 'bg-[#085d3a]' : 'bg-[#93370d]';
  }

  set swipeDateFrom(value: Date | undefined) {
    this.filterModel.swipeDateFrom = value;

    // If dateTo is before dateFrom, reset or adjust it
    if (this.filterModel.swipeDateFrom && value && this.filterModel.swipeDateFrom < value) {
      this.filterModel.swipeDateFrom = value; // or set it to value
    }
  }
  get swipeDateFrom(): Date | undefined {
    return this.filterModel.swipeDateFrom;
  }

  protected override mapModelToPdfRow(model: AttendanceLog): { [key: string]: any } {
    return {
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.CREATOR_EN_PDF')]:
        model.creatorNameEn ?? 'System',
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.CREATOR_AR_PDF')]:
        model.creatorNameAr ?? 'النظام',
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.CHANNEL_NAME')]: model.channelName,
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.SWIPE_TIME')]: this.swipeTimeArEn(
        model.swipeTime
      ),
    };
  }

  protected override getPdfTitle(): { ar: string; en: string } {
    return {
      ar: 'قائمة سجل الحضور والانصراف',
      en: 'Attendance Log List',
    };
  }

  override exportExcel(fileName: string = 'data.xlsx', isStoredProcedure: boolean = false): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
    };

    const fetchAll = isStoredProcedure
      ? this.service.loadMyAttendanceLogPaginatedSP(allDataParams, { ...this.appliedFilterModel! })
      : this.service.loadPaginated(allDataParams, { ...this.appliedFilterModel! });

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

  protected override mapModelToExcelRow(model: AttendanceLog): { [key: string]: any } {
    return {
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.SWIPE_TIME')]: this.swipeTimeArEn(
        model.swipeTime
      ),
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.CHANNEL_NAME')]: model.channelName,
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.CREATOR_EN')]:
        model.creatorNameEn ?? 'System',
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.CREATOR_AR')]:
        model.creatorNameAr ?? 'النظام',
      // hidden for release 1
      // [this.translateService.instant('ATTENDANCE_LOG_PAGE.PROCESSING_STATUS')]:
      //   this.translateService.instant('ATTENDANCE_LOG_PAGE.PROCESSING'),
    };
  }
  override exportPdf(
    fileName: string = this.translateService.instant('ATTENDANCE_LOG_PAGE.ATTENDANCE_LOGS_TITLE') +
      '.pdf'
  ): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
    };

    const fetchAll = this.service.loadMyAttendanceLogPaginatedSP(allDataParams, {
      ...this.appliedFilterModel!,
    });

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
  getDeviceName(attendanceLog: AttendanceLog) {
    if (attendanceLog.channelName) {
      return attendanceLog.channelName;
    } else {
      return attendanceLog.isRawData
        ? ''
        : this.translateService.instant('ATTENDANCE_LOG_PAGE.MANUAL');
    }
  }
}
