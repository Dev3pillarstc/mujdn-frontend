import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { Component, inject, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { MatDialogConfig } from '@angular/material/dialog';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { VisitorSelectionPopupComponent } from '../visitor-selection-popup/visitor-selection-popup.component';
import { Select } from 'primeng/select';
import { AddEditVisitRequestPopupComponent } from '../add-edit-visit-request-popup/add-edit-visit-request-popup.component';
import { ViewActionVisitRequestPopupComponent } from '../view-action-visit-request-popup/view-action-visit-request-popup.component';
import { TranslatePipe } from '@ngx-translate/core';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { Visit } from '@/models/features/visit/visit';
import { VisitService } from '@/services/features/visit/visit.service';
import { MyCreatedVisitFilter } from '@/models/features/visit/my-created-visit-filter';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { VisitStatusEnum } from '@/enums/visit-status-enum';
import { didVisitTimePassed, formatTimeTo12Hour } from '@/utils/general-helper';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LanguageService } from '@/services/shared/language.service';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { VisitStatusOption } from '@/models/features/visit/visit-status-option';
import { AuthService } from '@/services/auth/auth.service';
import { QrcodeVisitRequestPopupComponent } from '../qrcode-visit-request-popup/qrcode-visit-request-popup.component';
import { CustomValidators } from '@/validators/custom-validators';
import * as XLSX from 'xlsx';
import { AccessLocationService } from '@/services/features/business/access-location.service';
import { filter, from, map, mergeMap, switchMap } from 'rxjs';
import { AccessLocationLookup } from '@/models/features/business/access-location-lookup';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { registerIBMPlexArabicFont } from '../../../../../../public/assets/fonts/ibm-plex-font';

@Component({
  selector: 'app-my-created-visit-request-list',
  imports: [
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    PaginatorModule,
    DatePickerModule,
    FormsModule,
    TabsModule,
    Select,
    DatePicker,
    TranslatePipe,
  ],
  templateUrl: './my-created-visit-request-list.component.html',
  styleUrl: './my-created-visit-request-list.component.scss',
})
export class MyCreatedVisitRequestListComponent
  extends BaseListComponent<
    Visit,
    AddEditVisitRequestPopupComponent,
    VisitService,
    MyCreatedVisitFilter
  >
  implements OnChanges, OnInit
{
  @Input() isActive: boolean = false;
  @Input() departments: BaseLookupModel[] = [];
  @Input() nationalities: BaseLookupModel[] = [];
  @Input() visitStatusOptions: VisitStatusOption[] = [];
  accessLocations: BaseLookupModel[] = [];
  accessLocationService = inject(AccessLocationService);
  override filterModel: MyCreatedVisitFilter = new MyCreatedVisitFilter();
  visitService = inject(VisitService);
  languageService = inject(LanguageService);
  authService = inject(AuthService);

  private hasInitialized = false;

  // Enum reference for template
  VisitStatusEnum = VisitStatusEnum;

  override get service(): VisitService {
    return this.visitService;
  }

  visitorSelectionDialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  override dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };

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
      if (current && !previous) {
        this.loadDataIfNeeded();
      }
    }
  }
  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    const locale = this.isCurrentLanguageEnglish() ? 'en-US' : 'ar-EG';
    return formatTimeTo12Hour(timeString, locale);
  }

  get langOptionLabel(): string {
    const lang = this.languageService.getCurrentLanguage();
    return lang === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }

  override loadList() {
    return this.service.loadMyCreatedVisitsPaginated(this.paginationParams, {
      ...this.appliedFilterModel!,
    });
  }

  private loadDataIfNeeded(): void {
    // Load data when tab becomes active
    this.loadList().subscribe({
      next: (response) => this.handleLoadListSuccess(response),
      error: this.handleLoadListError,
    });
  }

  // Status badge methods
  getStatusBadgeClass(status: number): string {
    switch (status) {
      case VisitStatusEnum.NEW:
        return 'text-[14px] text-[#1849a9] px-2 py-1 w-fit inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#eff8ff] font-medium';
      case VisitStatusEnum.APPROVED:
        return 'text-[14px] text-[#085d3a] min-w-[101px] min-h-[24px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#ecfdf3] font-medium';
      case VisitStatusEnum.REJECTED:
        return 'text-[14px] text-[#912018] min-w-[101px] min-h-[24px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#fef3f2] font-medium';
      case VisitStatusEnum.EXPIRED:
        return 'text-[14px] text-[#912018] min-w-[101px] min-h-[24px] inline-flex justify-center items-center gap-2 px-2 rounded-full bg-[#fef3f2] font-medium';
      default:
        return 'text-[14px] text-gray-600 px-2 py-1 rounded-full bg-gray-100 font-medium';
    }
  }

  getStatusBadgeDotClass(status: number): string {
    switch (status) {
      case VisitStatusEnum.NEW:
        return 'w-[10px] h-[10px] bg-[#1849a9] rounded-full';
      case VisitStatusEnum.APPROVED:
        return 'w-[10px] h-[10px] bg-[#085d3a] rounded-full';
      case VisitStatusEnum.REJECTED:
        return 'w-[10px] h-[10px] bg-[#912018] rounded-full';
      case VisitStatusEnum.EXPIRED:
        return 'w-[10px] h-[10px] bg-[#912018] rounded-full';
      default:
        return 'w-[10px] h-[10px] bg-gray-600 rounded-full';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case VisitStatusEnum.NEW:
        return this.translateService.instant('VISIT_REQUEST_PAGE.NEW');
      case VisitStatusEnum.APPROVED:
        return this.translateService.instant('VISIT_REQUEST_PAGE.ACCEPTED');
      case VisitStatusEnum.REJECTED:
        return this.translateService.instant('VISIT_REQUEST_PAGE.REJECTED');
      case VisitStatusEnum.EXPIRED:
        return this.translateService.instant('VISIT_REQUEST_PAGE.EXPIRED');
      default:
        return '';
    }
  }

  // Department name display
  getDepartmentName(visit: Visit): string {
    if (this.isCurrentLanguageEnglish()) {
      return visit.targetDepartment?.nameEn || '';
    }
    return visit.targetDepartment?.nameAr || '';
  }

  override initListComponent(): void {}

  protected override getBreadcrumbKeys(): {
    labelKey: string;
    icon?: string;
    routerLink?: string;
  }[] {
    return [{ labelKey: 'VISIT_REQUEST_PAGE.MY_CREATED_VISITS' }];
  }

  showActionsButton(visit: Visit): boolean {
    if (!this.authService.isSecurityLeader) {
      return false;
    }

    if (!visit?.visitDate) {
      return false;
    }

    return !didVisitTimePassed(visit);
  }

  openDialog(model?: Visit) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: model,
      departments: this.departments,
      nationalities: this.nationalities,
      accessLocations: this.accessLocations,
    };
    dialogConfig.width = this.visitorSelectionDialogSize.width;
    dialogConfig.maxWidth = this.visitorSelectionDialogSize.maxWidth;

    const dialogRef = this.matDialog.open(VisitorSelectionPopupComponent as any, dialogConfig);

    return dialogRef
      .afterClosed()
      .subscribe((result: { action: DIALOG_ENUM; visitor?: Visit; viewMode?: ViewModeEnum }) => {
        if (result?.action === DIALOG_ENUM.OK && result.visitor) {
          // open edit dialog with visitor
          this.openEditDialog(result.visitor, result.viewMode);
        }
      });
  }

  openQrcodeDialog(model?: Visit) {
    this.getSuitableLocationsService(model).subscribe((locations) => {
      this.accessLocations = locations;
      let dialogConfig: MatDialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        model: model,
        accessLocations: this.accessLocations,
      };
      dialogConfig.width = this.visitorSelectionDialogSize.width;
      dialogConfig.maxWidth = this.visitorSelectionDialogSize.maxWidth;
      const dialogRef = this.matDialog.open(QrcodeVisitRequestPopupComponent as any, dialogConfig);

      return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
        if (result === DIALOG_ENUM.OK) {
          this.loadDataIfNeeded();
        }
      });
    });
  }

  openViewDialog(model?: Visit) {
    this.setNationalityNames(model!);
    if (model?.visitStatus === VisitStatusEnum.APPROVED) {
      this.openQrcodeDialog(model);
    } else {
      this.getSuitableLocationsService(model).subscribe((locations) => {
        this.accessLocations = locations;
        let dialogConfig: MatDialogConfig = new MatDialogConfig();
        dialogConfig.data = {
          model: model,
          accessLocations: this.accessLocations,
        };
        dialogConfig.width = this.dialogSize.width;
        dialogConfig.maxWidth = this.dialogSize.maxWidth;
        const dialogRef = this.matDialog.open(
          ViewActionVisitRequestPopupComponent as any,
          dialogConfig
        );

        dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
          if (result === DIALOG_ENUM.OK) {
            this.loadDataIfNeeded();
          }
        });
      });
    }
  }

  openTakeActionDialog(model: Visit) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    this.setNationalityNames(model);

    this.getSuitableLocationsService(model).subscribe((locations) => {
      this.accessLocations = locations;
      dialogConfig.data = {
        model: model,
        viewMode: ViewModeEnum.TAKE_ACTION,
        accessLocations: this.accessLocations,
      };
      dialogConfig.width = this.dialogSize.width;
      dialogConfig.maxWidth = this.dialogSize.maxWidth;

      const dialogRef = this.matDialog.open(
        ViewActionVisitRequestPopupComponent as any,
        dialogConfig
      );

      dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
        if (result === DIALOG_ENUM.OK) {
          this.loadDataIfNeeded();
        }
      });
    });
  }

  openEditDialog(model?: Visit, viewMode?: ViewModeEnum) {
    const visit = model ?? new Visit();
    viewMode = viewMode ?? (model ? ViewModeEnum.EDIT : ViewModeEnum.CREATE);
    this.getSuitableLocationsService(model).subscribe((locations) => {
      this.accessLocations = locations;
      this.openBaseDialog(AddEditVisitRequestPopupComponent as any, visit, viewMode, {
        departments: this.departments,
        nationalities: this.nationalities,
        accessLocations: this.accessLocations,
      });
    });
  }

  getSuitableLocationsService(model?: Visit) {
    const visit = model?.id ? model : new Visit();
    const viewMode = model ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    return viewMode == ViewModeEnum.CREATE
      ? this.accessLocationService.getLocationsConnectedToDevice()
      : this.accessLocationService.getConnectedLocationsWithStatus().pipe(
          map((locations: AccessLocationLookup[]) => {
            return locations.filter((loc) => {
              return loc.status == true || visit.accessLocationIds?.includes(loc.id);
            });
          })
        );
  }

  override exportExcel(fileName: string = 'data.xlsx', isStoredProcedure: boolean = false): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
    };

    const fetchAll = isStoredProcedure
      ? this.service.loadPaginatedSP(allDataParams, { ...this.appliedFilterModel! })
      : this.service.loadMyCreatedVisitsPaginated(allDataParams, { ...this.appliedFilterModel! });

    fetchAll.subscribe({
      next: (response) => {
        const fullList = response.list || [];
        if (fullList.length > 0) {
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

  protected override mapModelToExcelRow(model: Visit): { [key: string]: any } {
    return {
      [this.translateService.instant('VISIT_REQUEST_PAGE.NATIONAL_ID')]: model.nationalId,
      [this.translateService.instant('VISIT_REQUEST_PAGE.VISITOR_NAME')]: model.fullName,
      [this.translateService.instant('VISIT_REQUEST_PAGE.MOBILE_NUMBER')]: model.phoneNumber,
      [this.translateService.instant('VISIT_REQUEST_PAGE.VISITOR_ORGANIZATION')]:
        model.visitorOrganization,
      [this.translateService.instant('VISIT_REQUEST_PAGE.TARGET_DEPARTMENT')]:
        this.getDepartmentName(model),
      [this.translateService.instant('VISIT_REQUEST_PAGE.VISIT_STATUS')]: this.getStatusText(
        model.visitStatus
      ),
      [this.translateService.instant('VISIT_REQUEST_PAGE.ENTRY')]: this.formatTime(
        model.arrivalTime?.toString() || ''
      ),
      [this.translateService.instant('VISIT_REQUEST_PAGE.EXIT')]: this.formatTime(
        model.leaveTime?.toString() || ''
      ),
    };
  }
  private setNationalityNames(model: Visit | null): void {
    if (!model) return;

    const nationality = this.nationalities.find((n) => n.id === model.fkNationalityId);

    model.nationalityNameAr = nationality?.nameAr ?? '';
    model.nationalityNameEn = nationality?.nameEn ?? '';
  }

  getPropertyName() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
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

    const fetchAll = this.service.loadMyCreatedVisitsPaginated(allDataParams, {
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
