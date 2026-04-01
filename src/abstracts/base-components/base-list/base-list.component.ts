import { Directive, inject, OnDestroy, OnInit } from '@angular/core';
import { PaginationInfo } from '@/models/shared/response/pagination-info';
import { MenuItem } from 'primeng/api';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginatorState } from 'primeng/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { registerIBMPlexArabicFont } from '../../../../public/assets/fonts/ibm-plex-font';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { ConfirmationService } from '@/services/shared/confirmation.service';
import { AlertService } from '@/services/shared/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { filter, mapTo, of, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { CustomValidators } from '@/validators/custom-validators';

@Directive()
export abstract class BaseListComponent<
    Model,
    PopupComponent,
    TService extends BaseCrudService<Model, string | number>,
    FilterModel,
  >
  implements OnInit, OnDestroy
{
  abstract dialogSize: any;
  first: number = 0;
  rows: number = 10;
  destroy$: Subject<void> = new Subject<void>();

  paginationInfo: PaginationInfo = new PaginationInfo();
  breadcrumbs: MenuItem[] = [];
  list: Model[] = [];
  paginationParams: PaginationParams = new PaginationParams();
  matDialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);
  langService = inject(LanguageService);
  confirmService = inject(ConfirmationService);
  alertsService = inject(AlertService);
  translateService = inject(TranslateService);
  alertService = inject(AlertService);
  declare selectedModel?: Model;
  home = {
    label: this.translateService.instant('COMMON.HOME'),
    icon: 'pi pi-home',
    routerLink: '/home',
  };

  abstract get filterModel(): FilterModel;

  abstract set filterModel(val: FilterModel);

  abstract get service(): TService;

  abstract openDialog(nationality: Model): void;

  abstract initListComponent(): void;

  afterDeleteModel() {
    const successObject = { messages: ['COMMON.DELETED_SUCCESSFULLY'] };
    this.alertService.showSuccessMessage(successObject);
  }

  protected _appliedFilterModel: FilterModel = {} as FilterModel;

  get appliedFilterModel(): FilterModel {
    return this._appliedFilterModel;
  }

  set appliedFilterModel(val: FilterModel) {
    this._appliedFilterModel = val;
  }

  openBaseDialog(
    popupComponent: PopupComponent,
    model: Model,
    viewMode: ViewModeEnum,
    lookups?: {
      [key: string]: any[];
    }
  ) {
    const clonedModel = Object.assign(Object.create(Object.getPrototypeOf(model)), model);
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: clonedModel,
      lookups: lookups,
      viewMode: viewMode,
    };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    const dialogRef = this.matDialog.open(popupComponent as any, dialogConfig);

    return dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: DIALOG_ENUM) => {
        if (result && result == DIALOG_ENUM.OK) {
          this.loadList().subscribe({
            next: (response) => this.handleLoadListSuccess(response),
            error: this.handleLoadListError,
          });
        }
      });
  }

  openBaseDialogSP(
    popupComponent: PopupComponent,
    model: Model,
    viewMode: ViewModeEnum,
    lookups?: {
      [key: string]: any[];
    }
  ) {
    const clonedModel = Object.assign(Object.create(Object.getPrototypeOf(model)), model);
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: clonedModel,
      lookups: lookups,
      viewMode: viewMode,
    };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    const dialogRef = this.matDialog.open(popupComponent as any, dialogConfig);

    return dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: DIALOG_ENUM) => {
        if (result && result == DIALOG_ENUM.OK) {
          this.loadListSP().subscribe({
            next: (response) => this.handleLoadListSuccess(response),
            error: this.handleLoadListError,
          });
        }
      });
  }

  setHomeItem(): void {
    this.home = {
      label: this.translateService.instant('COMMON.HOME'),
      icon: 'pi pi-home',
      routerLink: '/home',
    };
  }

  ngOnInit() {
    this.setHomeItem();
    this.initBreadcrumbs();
    this.list = this.activatedRoute.snapshot.data['list']?.list;
    this.paginationInfo = this.activatedRoute.snapshot.data['list']?.paginationInfo;
    this.initListComponent();
    // Listen to language changes
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setHomeItem();
      this.initBreadcrumbs();
    });
  }

  loadList() {
    return this.service.loadPaginated(this.paginationParams, { ...this._appliedFilterModel! });
  }

  loadListSP() {
    return this.service.loadPaginatedSP(this.paginationParams, { ...this._appliedFilterModel! });
  }

  search(isStoredProcedure: boolean = false) {
    this._appliedFilterModel = { ...this.filterModel };
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    if (isStoredProcedure) {
      this.loadListSP().subscribe({
        next: (response) => this.handleLoadListSuccess(response),
        error: this.handleLoadListError,
      });
    } else {
      this.loadList().subscribe({
        next: (response) => this.handleLoadListSuccess(response),
        error: this.handleLoadListError,
      });
    }
  }

  resetSearch(isStoredProcedure: boolean = false) {
    this.filterModel = {} as FilterModel;
    this._appliedFilterModel = {} as FilterModel;

    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    if (isStoredProcedure) {
      this.loadListSP().subscribe({
        next: (response) => this.handleLoadListSuccess(response),
        error: this.handleLoadListError,
      });
    } else {
      this.loadList().subscribe({
        next: (response) => this.handleLoadListSuccess(response),
        error: this.handleLoadListError,
      });
    }
  }

  onPageChange(event: PaginatorState, isStoredProcedure: boolean = false) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    if (isStoredProcedure) {
      this.loadListSP().subscribe({
        next: (response) => this.handleLoadListSuccess(response),
        error: this.handleLoadListError,
      });
    } else {
      this.loadList().subscribe({
        next: (response) => this.handleLoadListSuccess(response),
        error: this.handleLoadListError,
      });
    }
  }

  exportExcel(fileName: string = 'data.xlsx', isStoredProcedure: boolean = false): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
    };

    const fetchAll = isStoredProcedure
      ? this.service.loadPaginatedSP(allDataParams, { ...this._appliedFilterModel! })
      : this.service.loadPaginated(allDataParams, { ...this._appliedFilterModel! });

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

  deleteModel(id: string | number, isStoredProcedure: boolean = false) {
    const dialogRef = this.confirmService.open({
      icon: 'warning',
      messages: ['COMMON.CONFIRM_DELETE'],
      confirmText: 'COMMON.OK',
      cancelText: 'COMMON.CANCEL',
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        filter((result) => result === DIALOG_ENUM.OK),

        // delete
        switchMap(() => this.service.delete(id)),

        // if success -> show toast (afterDeleteModel) and PAUSE a bit
        switchMap((response: any) => {
          if (response?.error == null) {
            this.afterDeleteModel(); // shows "deleted successfully"
            // return timer(700).pipe(mapTo(response)); // <-- delay before spinner/reload
          }
          return of(response); // keep flowing even if backend returns an error object
        }),

        // reload (this is where your spinner likely starts)
        switchMap(() => (isStoredProcedure ? this.loadListSP() : this.loadList())),

        // if page becomes empty, go back to page 1 and reload
        switchMap((response: any) => {
          if (response?.list?.length === 0) {
            this.paginationParams.pageNumber = 1;
            return isStoredProcedure ? this.loadListSP() : this.loadList();
          }
          return of(response);
        })
      )
      .subscribe({
        next: (response) => {
          this.handleLoadListSuccess(response);
        },
        error: this.handleLoadListError,
      });
  }

  handleLoadListSuccess(response: PaginatedList<Model>) {
    this.list = response.list || [];

    if (response.paginationInfo) {
      this.paginationInfoMap(response);
    } else {
      this.paginationInfo.totalItems = this.list.length;
    }
  }

  handleLoadListError() {
    this.list = [];
    this.paginationInfo.totalItems = 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  paginationInfoMap(response: PaginatedList<Model>) {
    const paginationInfo = response.paginationInfo;
    this.paginationInfo.totalItems = paginationInfo.totalItems || 0;
    this.paginationParams.pageSize = paginationInfo.pageSize || 10;
    this.paginationParams.pageNumber = paginationInfo.currentPage || 1;

    this.rows = this.paginationParams.pageSize;
    this.first = (this.paginationParams.pageNumber - 1) * this.paginationParams.pageSize;
  }

  protected abstract getBreadcrumbKeys(): {
    labelKey: string;
    icon?: string;
    routerLink?: string;
  }[];

  protected abstract mapModelToExcelRow(model: Model): { [key: string]: any };

  protected mapModelToPdfRow(model: Model): { [key: string]: any } {
    return this.mapModelToExcelRow(model);
  }

  protected getPdfTitle(): { ar: string; en: string } {
    return { ar: '', en: '' };
  }

exportPdf(fileName: string = 'data.pdf', isStoredProcedure: boolean = false): void {
  const allDataParams = {
    ...this.paginationParams,
    pageNumber: 1,
    pageSize: CustomValidators.defaultLengths.INT_MAX,
  };

  const fetchAll = isStoredProcedure
    ? this.service.loadPaginatedSP(allDataParams, { ...this._appliedFilterModel! })
    : this.service.loadPaginated(allDataParams, { ...this._appliedFilterModel! });

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

      // ── Table headers & body ──────────────────────────────────────────────
      const rawHead = Object.keys(transformedData[0]);
      const head    = isRTL ? [[...rawHead].reverse()] : [rawHead];
      const body    = transformedData.map((row) => {
        const values = Object.values(row).map(formatCell);
        return isRTL ? [...values].reverse() : values;
      });

      // ── Colours ───────────────────────────────────────────────────────────
      const HEADER_BG          : [number, number, number] = [243, 244, 246];
      const HEADER_TEXT        : [number, number, number] = [51,  65,  85 ];
      const ROW                : [number, number, number] = [255, 255, 255];
      const HEADER_BORDER_COLOR: [number, number, number] = [226, 232, 240];
      const BODY_TEXT          : [number, number, number] = [51,  51,  51 ];

      // ── Document setup ───────────────────────────────────────────────────
      const doc      = new jsPDF({ orientation: 'landscape', format: 'a4' });
      registerIBMPlexArabicFont(doc);

      const pageWidth = doc.internal.pageSize.getWidth();
      const colCount  = head[0].length;
      const usableW   = pageWidth - 20;
      const colWidth  = usableW / colCount;

      const columnStyles: { [key: number]: any } = {};
      for (let i = 0; i < colCount; i++) {
        columnStyles[i] = { cellWidth: colWidth, halign: 'center', valign: 'middle' };
      }

      // ── Title ────────────────────────────────────────────────────────────
      const titles = this.getPdfTitle();

      autoTable(doc, {
        head,
        body,

        // ── Global cell style ─────────────────────────────────────────────
        styles: {
          font        : 'IBMPlexSansArabic',
          fontStyle   : 'normal',
          fontSize    : 9,
          halign      : 'center',
          valign      : 'middle',
          textColor   : BODY_TEXT,
          lineWidth   : 0,
          cellPadding : 4,
        },

        // ── Header row ───────────────────────────────────────────────────
        headStyles: {
          font          : 'IBMPlexSansArabic',
          fontStyle     : 'normal',
          fontSize      : 9,
          halign        : 'center',
          valign        : 'middle',
          fillColor     : HEADER_BG,
          textColor     : HEADER_TEXT,
          lineColor     : HEADER_BORDER_COLOR,
          lineWidth     : 0.25,
          cellPadding   : 5,
          minCellHeight : 12,
        },

        // ── Body rows ────────────────────────────────────────────────────
        bodyStyles        : { fillColor: ROW },
        alternateRowStyles: { fillColor: ROW },

        margin      : { top: 18, right: 10, bottom: 10, left: 10 },
        columnStyles,
        tableWidth  : 'auto',

        // ── Bottom border only on every cell ─────────────────────────────
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

        // ── Title drawn on every page ─────────────────────────────────────
        didDrawPage: (_data) => {
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

      // ── Outer table border ────────────────────────────────────────────────
      const last = (doc as any).lastAutoTable;
      if (last) {
        const marginLeft  = (last.settings?.margin?.left  ?? 10) as number;
        const marginRight = (last.settings?.margin?.right ?? 10) as number;
        const startY      = (last.startY ?? last.settings?.margin?.top ?? 18) as number;
        const finalY      = (last.finalY ?? startY) as number;
        const tableW      = pageWidth - marginLeft - marginRight;
        const tableH      = finalY - startY;

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

  private initBreadcrumbs(): void {
    this.breadcrumbs = this.getBreadcrumbKeys().map((item) => ({
      label: this.translateService.instant(item.labelKey),
      icon: item.icon,
      routerLink: item.routerLink,
    }));
  }
}
