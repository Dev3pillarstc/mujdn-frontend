import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { PresenceInquiriesPopupComponent } from '../presence-inquiries-popup/presence-inquiries-popup.component';
import { FormsModule } from '@angular/forms';
import { PresenceInquiryFilter } from '@/models/features/presence-inquiry/presence-inquiry-filter';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { PresenceInquiryService } from '@/services/features/presence-inquiry.service';
import { PresenceInquiry } from '@/models/features/presence-inquiry/presence-inquiry';
import { TranslatePipe } from '@ngx-translate/core';
import { USER_PRESENCE_INQUIRY_STATUS_ENUM } from '@/enums/user-presence-inquiry-status-enum';
import { UserPresenceInquiryStatusService } from '@/services/features/user-presence-inquiry-status.service';
import { LanguageService } from '@/services/shared/language.service';
import { CustomValidators } from '@/validators/custom-validators';
import * as XLSX from 'xlsx';
import { formatDateTo12Hour } from '@/utils/general-helper';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { registerIBMPlexArabicFont } from '../../../../../public/assets/fonts/ibm-plex-font';

@Component({
  selector: 'app-my-presence-inquiries-list',
  imports: [
    InputTextModule,
    CommonModule,
    PaginatorModule,
    Select,
    DatePickerModule,
    TabsModule,
    TableModule,
    FormsModule,
    TranslatePipe,
  ],
  providers: [DatePipe],
  templateUrl: './my-presence-inquiries-list.component.html',
  styleUrl: './my-presence-inquiries-list.component.scss',
})
export class MyPresenceInquiriesListComponent extends BaseListComponent<
  PresenceInquiry,
  PresenceInquiriesPopupComponent,
  PresenceInquiryService,
  PresenceInquiryFilter
> {
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };

  presenceInquiryService = inject(PresenceInquiryService);
  filterModel: PresenceInquiryFilter = new PresenceInquiryFilter();
  userPresenceInquiryStatusService = inject(UserPresenceInquiryStatusService);
  userPresenceInquiryStatuses: BaseLookupModel[] = [];
  userInquiryStatusEnum = USER_PRESENCE_INQUIRY_STATUS_ENUM;
  languageService = inject(LanguageService);
  datePipe = inject(DatePipe);

  override get service() {
    return this.presenceInquiryService;
  }

  override initListComponent(): void {
    // Preload lookup data
    this.userPresenceInquiryStatusService.getLookup().subscribe((res) => {
      this.userPresenceInquiryStatuses = res;
    });
  }

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'PRESENCE_INQUIRIES_PAGE.PRESENCE_INQUIRIES' }];
  }

  override openDialog(model: PresenceInquiry): void {
    // No dialog currently needed for My Presence Inquiries
  }

  override loadList() {
    return this.service.loadMyPresenceInquiriesPaginated(this.paginationParams, {
      ...this.appliedFilterModel!,
    });
  }

  protected override mapModelToExcelRow(model: PresenceInquiry): { [key: string]: any } {
    return {
      [this.translateService.instant('INQUIRIES_PAGE.INQUIRY_DATE')]: this.formatDate(
        model.assignedDate
      ),
      [this.translateService.instant('INQUIRIES_PAGE.INQUIRY_TIME')]: this.formatTime(
        model.assignedDate ? new Date(model.assignedDate) : undefined
      ),
      [this.translateService.instant('INQUIRIES_PAGE.ALLOWED_ATTENDANCE_PERIOD')]: model.buffer,
      [this.translateService.instant('INQUIRIES_PAGE.CONFIRMATION_STATUS')]: this.getStatusName(
        model.assignedUsers?.[0]?.inquiryStatusId ?? 0
      ),
    };
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

  getStatusName(id: number): string {
    const status = this.userPresenceInquiryStatuses.find((d) => d.id === id);
    return this.languageService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH
      ? (status?.nameEn ?? '')
      : (status?.nameAr ?? '');
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

  override exportExcel(fileName: string = 'MyPresenceProofInquiry.xlsx'): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
    };

    this.service
      .loadMyPresenceInquiriesPaginated(allDataParams, {
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
  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
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

    const fetchAll = this.service.loadMyPresenceInquiriesPaginated(allDataParams, {
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
