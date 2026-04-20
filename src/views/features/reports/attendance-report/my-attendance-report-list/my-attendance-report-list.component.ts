import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import AttendanceReport from '@/models/features/attendance/attendance-report/attendance-report';
import { AttendanceReportFilter } from '@/models/features/attendance/attendance-report/attendance-report-filter';
import { AttendanceReportService } from '@/services/features/attendance-report.service';
import { LanguageService } from '@/services/shared/language.service';
import { CustomValidators } from '@/validators/custom-validators';
import * as XLSX from 'xlsx';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { DepartmentService } from '@/services/features/lookups/department.service';
import {
  ATTENDANCE_STATUS_ENUM,
  ATTENDANCE_STATUS_CONFIG,
  ATTENDANCE_STATUS_OPTIONS,
} from '@/enums/attendance-status-enum';
import { SHIFT_TYPE_ENUM } from '@/enums/shift-type-enum';
import { formatDateTo12Hour } from '@/utils/general-helper';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { registerIBMPlexArabicFont } from '../../../../../../public/assets/fonts/ibm-plex-font';

@Component({
  selector: 'app-my-attendance-report-list',
  imports: [
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    DatePickerModule,
    FormsModule,
    Select,
    TranslatePipe,
  ],
  providers: [DatePipe],

  templateUrl: './my-attendance-report-list.component.html',
  styleUrl: './my-attendance-report-list.component.scss',
})
export class MyAttendanceReportListComponent extends BaseListComponent<
  AttendanceReport,
  any, // No dialog for now, replace if needed
  AttendanceReportService,
  AttendanceReportFilter
> {
  override dialogSize = {
    width: '100%',
    maxWidth: '800px',
  };

  attendanceReportService = inject(AttendanceReportService);
  filterModel: AttendanceReportFilter = new AttendanceReportFilter();
  languageService = inject(LanguageService);
  datePipe = inject(DatePipe);
  departments: BaseLookupModel[] = [];
  departmentService = inject(DepartmentService);
  shiftType = SHIFT_TYPE_ENUM;
  attendanceStatuses = ATTENDANCE_STATUS_OPTIONS; // import from your enum file

  override get service() {
    return this.attendanceReportService;
  }

  override initListComponent(): void {
    this.departmentService.getLookup().subscribe((res) => {
      this.departments = res;
    });
  }

  // preload lookups if you need (e.g., shifts, holidays)

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'ATTENDANCE_REPORT_PAGE.ATTENDANCE_REPORTS' }];
  }

  override openDialog(model: AttendanceReport): void {
    // No dialog currently needed for Attendance Reports
  }

  override loadList() {
    return this.service.loadMyAttendanceReportsPaginated(this.paginationParams, {
      ...this.appliedFilterModel!,
    });
  }

  protected override mapModelToExcelRow(model: AttendanceReport): { [key: string]: any } {
    return {
      [this.translateService.instant('ATTENDANCE_REPORT_PAGE.DATE')]: this.formatDate(
        model.processingDate
      ),

      [this.translateService.instant('ATTENDANCE_REPORT_PAGE.SHIFT_NAME')]: model.getShiftName(),
      [this.translateService.instant('ATTENDANCE_REPORT_PAGE.SHIFT_TYPE')]:
        model.shiftType === SHIFT_TYPE_ENUM.DEFAULT
          ? this.translateService.instant('ATTENDANCE_REPORT_PAGE.DEFAULT_SHIFT')
          : this.translateService.instant('ATTENDANCE_REPORT_PAGE.SPECIAL_SHIFT'),
      [this.translateService.instant('ATTENDANCE_REPORT_PAGE.LEAVE_NAME')]: model.getHolidayName(),
      [this.translateService.instant('ATTENDANCE_REPORT_PAGE.MISSION_NAME')]:
        model.getMissionName(),
      [this.translateService.instant('ATTENDANCE_REPORT_PAGE.MISSION_TYPE')]:
        model.getMissionTypeTranslationKey()
          ? this.translateService.instant(model.getMissionTypeTranslationKey())
          : '',
      [this.translateService.instant('ATTENDANCE_REPORT_PAGE.PERMISSIONS')]:
        this.getPermissionLabel(model)
          ? this.translateService.instant(this.getPermissionLabel(model))
          : '',
      [this.translateService.instant('ATTENDANCE_REPORT_PAGE.PRESENCE_INQUIRY')]:
        model.isPresenceInquirySucceed == null
          ? '' // show empty if null
          : model.isPresenceInquirySucceed
            ? this.translateService.instant('INQUIRIES_PAGE.CONFIRMED')
            : this.translateService.instant('INQUIRIES_PAGE.NOT_CONFIRMED'),
      [this.translateService.instant('ATTENDANCE_REPORT_PAGE.SHIFT_PRESENCE_INQUIRY')]:
        model.isShiftPresenceInquirySucceed == null
          ? '' // show empty if null
          : model.isShiftPresenceInquirySucceed
            ? this.translateService.instant('INQUIRIES_PAGE.CONFIRMED')
            : this.translateService.instant('INQUIRIES_PAGE.NOT_CONFIRMED'),

      [this.translateService.instant('ATTENDANCE_REPORT_PAGE.CHECKIN_TIME')]: this.formatTime(
        model.firstAttendanceFingerPrint ? new Date(model.firstAttendanceFingerPrint) : undefined
      ),
      [this.translateService.instant('ATTENDANCE_REPORT_PAGE.CHECKOUT_TIME')]: this.formatTime(
        model.lastLeaveFingerPrint ? new Date(model.lastLeaveFingerPrint) : undefined
      ),
      [this.translateService.instant('ATTENDANCE_REPORT_PAGE.STATUS')]: model.attendanceStatus
        ? this.translateService.instant(this.getStatusConfig(model.attendanceStatus).labelKey)
        : '',
    };
  }

  formatDate(date: string | Date | null | undefined): string {
    if (!date) return '-';
    return this.datePipe.transform(new Date(date), 'dd-MM-yyyy') ?? '-';
  }
  formatTime(date: Date | null | undefined): string {
    if (!date) return '-';
    const locale = this.isCurrentLanguageEnglish() ? 'en-US' : 'ar-EG';
    return formatDateTo12Hour(date, locale);
  }
  override exportExcel(fileName: string = 'My Attendance report.xlsx'): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
    };

    this.service
      .loadMyAttendanceReportsPaginated(allDataParams, {
        ...this.appliedFilterModel!,
      })
      .subscribe({
        next: (response) => {
          const fullList = response.list || [];
          if (fullList.length === 0) {
            this.alertsService.showErrorMessage({ messages: ['COMMON.NO_DATA_TO_EXPORT'] });
            return;
          }

          const isRTL = this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC;
          const transformedData = fullList.map((item) => this.mapModelToExcelRow(item));
          const ws = XLSX.utils.json_to_sheet(transformedData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          wb.Workbook = { Views: [{ RTL: isRTL }] };
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, fileName);
        },
        error: (_) => {
          this.alertsService.showErrorMessage({ messages: ['COMMON.ERROR'] });
        },
      });
  }
  set dateFrom(value: Date | null) {
    this.filterModel.dateFrom = value;
    if (this.filterModel.dateTo && value && this.filterModel.dateTo < value) {
      this.filterModel.dateTo = null;
    }
  }

  get dateFrom(): Date | null | undefined {
    return this.filterModel.dateFrom;
  }
  getPropertyName() {
    return this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }
  getStatusConfig(status: ATTENDANCE_STATUS_ENUM) {
    return (
      ATTENDANCE_STATUS_CONFIG[status] ?? ATTENDANCE_STATUS_CONFIG[ATTENDANCE_STATUS_ENUM.ABSENT]
    );
  }
  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }

  getPermissionLabel(attendance: any): string {
    if (attendance.attendancePermissionId && attendance.leavePermissionId) {
      return 'ATTENDANCE_REPORT_PAGE.PRESENCE_LEAVE';
    }
    if (attendance.leavePermissionId && !attendance.attendancePermissionId) {
      return 'ATTENDANCE_REPORT_PAGE.LEAVE';
    }
    if (attendance.attendancePermissionId && !attendance.leavePermissionId) {
      return 'ATTENDANCE_REPORT_PAGE.PRESENCE';
    }
    return '';
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

    const fetchAll = this.service.loadMyAttendanceReportsPaginated(allDataParams, {
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
}
