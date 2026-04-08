import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { SplitButton } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ViewMissionDataPopupComponent } from '../popups/view-mission-data-popup/view-mission-data-popup.component';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { WorkMission } from '@/models/features/business/work-mission';
import { WorkMissionService } from '@/services/features/business/work-mission.service';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import MyWorkMissionFilter from '@/models/features/business/my-work-missions-filter';
import { PaginationInfo } from '@/models/shared/response/pagination-info';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { CustomValidators } from '@/validators/custom-validators';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { registerIBMPlexArabicFont } from '../../../../../public/assets/fonts/ibm-plex-font';
interface Adminstration {
  type: string;
}
@Component({
  selector: 'app-my-work-mission-list',
  imports: [
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    DatePickerModule,
    TabsModule,
    FormsModule,
    TranslatePipe,
    Select,
  ],
  templateUrl: './my-work-mission-list.component.html',
  styleUrl: './my-work-mission-list.component.scss',
})
export class MyWorkMissionListComponent extends BaseListComponent<
  WorkMission,
  ViewMissionDataPopupComponent,
  WorkMissionService,
  MyWorkMissionFilter
> {
  filterOptions: MyWorkMissionFilter = new MyWorkMissionFilter();
  workMissionService = inject(WorkMissionService);
  creators: BaseLookupModel[] = [];
  myMissions: WorkMission[] = [];
  override list: WorkMission[] = [];
  override dialogSize: any = {
    width: '100%',
    maxWidth: '1024px',
  };
  override get filterModel(): MyWorkMissionFilter {
    return this.filterOptions;
  }

  override set filterModel(val: MyWorkMissionFilter) {
    this.filterOptions = val;
  }

  override get service(): WorkMissionService {
    return this.workMissionService;
  }
  addOrEditModel(model?: WorkMission): void {
    this.openDialog(model);
  }
  override openDialog(model?: WorkMission): void {
    const mission = model || new WorkMission();
    const viewMode = model?.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(ViewMissionDataPopupComponent as any, mission, viewMode);
  }
  override search() {
    this.appliedFilterModel = { ...this.filterModel };
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    this.loadMyPresenceInquiriesList();
  }
  override resetSearch() {
    this.filterModel = new MyWorkMissionFilter();
    this.appliedFilterModel = new MyWorkMissionFilter();
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.loadMyPresenceInquiriesList();
  }
  loadMyPresenceInquiriesList() {
    this.service
      .getMyWorkMissionsAsync(this.paginationParams, { ...this.appliedFilterModel! })
      .subscribe((res: PaginatedListResponseData<WorkMission>) => {
        this.list = res.data.list;
        this.paginationInfo = res.data.paginationInfo;
      });
  }
  override initListComponent(): void {
    this.loadInitialData();
  }
  resetFilter(): void {
    this.filterModel = new MyWorkMissionFilter(); // fresh empty filter
  }
  loadMyMissions(): void {
    // Always fetch fresh data
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    this.service
      .getMyWorkMissionsAsync(this.paginationParams, { ...this.appliedFilterModel })
      .subscribe((res: PaginatedListResponseData<WorkMission>) => {
        this.list = res.data.list;
        this.paginationInfo = res.data.paginationInfo;
      });
  }

  private loadInitialData(): void {
    const resolverData = this.activatedRoute.snapshot.data['list'];
    this.creators = resolverData.creators || [];
    this.myMissions = resolverData.myMissions.list || [];
    this.list = this.myMissions;
    this.paginationInfo = {
      ...new PaginationInfo(),
      ...resolverData.myMissions.paginationInfo,
      totalItems: resolverData.myMissions.paginationInfo.totalItems || 0,
    };
  }

  protected override getBreadcrumbKeys(): {
    labelKey: string;
    icon?: string;
    routerLink?: string;
  }[] {
    return [{ labelKey: 'dashboard' }, { labelKey: 'workMissions' }];
  }

  protected override mapModelToExcelRow(model: WorkMission): { [key: string]: any } {
    return {
      [this.translateService.instant('WORK_MISSIONS.MISSION_NAME_AR')]: model.nameAr,
      [this.translateService.instant('WORK_MISSIONS.MISSION_NAME_EN')]: model.nameEn,
      [this.translateService.instant('WORK_MISSIONS.START_DATE')]: model.startDate,
      [this.translateService.instant('WORK_MISSIONS.END_DATE')]: model.endDate,
      [this.translateService.instant('WORK_MISSIONS.MISSION_CREATOR_AR')]:
        model.missionCreator?.nameAr || '',
      [this.translateService.instant('WORK_MISSIONS.MISSION_CREATOR_EN')]:
        model.missionCreator?.nameEn || '',
    };
  }
  override exportExcel(
    fileName: string = 'my-work-missions.xlsx',
    isStoredProcedure?: boolean
  ): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
    };

    const fetchAll = this.service.getMyWorkMissionsAsync(allDataParams, {
      ...this.appliedFilterModel!,
    });

    fetchAll.subscribe({
      next: (response) => {
        const fullList = (response.data?.list || []) as any[];
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

    const fetchAll = this.service.getMyWorkMissionsAsync(allDataParams, {
      ...this.appliedFilterModel!,
    });

    const isRTL = this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC;

    fetchAll.subscribe({
      next: (response) => {
        const fullList = response.data.list || [];
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

  getPropertyName(): string {
    return this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }

  isCurrentLanguageEnglish(): boolean {
    return this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH;
  }
}
