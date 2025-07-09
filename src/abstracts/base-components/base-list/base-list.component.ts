import { Directive, inject, OnInit } from '@angular/core';
import { PaginationInfo } from '@/models/shared/response/pagination-info';
import { MenuItem } from 'primeng/api';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { NationalityFilter } from '@/models/features/lookups/Nationality-filter';
import { PaginatorState } from 'primeng/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import * as XLSX from 'xlsx';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { ConfirmationService } from '@/services/shared/confirmation.service';
import { AlertService } from '@/services/shared/alert.service';

@Directive()
export abstract class BaseListComponent<
  Model,
  PopupComponent,
  TService extends BaseCrudService<Model, string | number>,
  FilterModel,
> implements OnInit
{
  abstract dialogSize: any;
  first: number = 0;
  rows: number = 10;
  paginationInfo: PaginationInfo = new PaginationInfo();
  items: MenuItem[] | undefined;
  list: Model[] = [];
  paginationParams: PaginationParams = new PaginationParams();
  matDialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);
  langService = inject(LanguageService);
  confirmService = inject(ConfirmationService);
  alertsService = inject(AlertService);
  declare selectedModel?: Model;

  abstract get filterModel(): FilterModel;

  abstract set filterModel(val: FilterModel);

  abstract get service(): TService;

  abstract openDialog(nationality: Model): void;

  abstract initListComponent(): void;

  openBaseDialog(
    popupComponent: PopupComponent,
    model: Model,
    viewMode: ViewModeEnum,
    lookups?: {
      [key: string]: any[];
    }
  ) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = { model: model, lookups: lookups, viewMode: viewMode };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    const dialogRef = this.matDialog.open(popupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      if (result && result == DIALOG_ENUM.OK) {
        this.loadList();
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
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = { model: model, lookups: lookups, viewMode: viewMode };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    const dialogRef = this.matDialog.open(popupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      if (result && result == DIALOG_ENUM.OK) {
        this.loadListSP();
      }
    });
  }

  ngOnInit() {
    this.list = this.activatedRoute.snapshot.data['list']?.list;
    this.paginationInfo = this.activatedRoute.snapshot.data['list']?.paginationInfo;
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'قائمة الجنسيات' }];
    this.initListComponent();
    console.log(this.list);
  }

  loadList() {
    this.service.loadPaginated(this.paginationParams, { ...this.filterModel! }).subscribe({
      next: (response) => {
        this.list = response.list || [];

        if (response.paginationInfo) {
          this.paginationInfoMap(response);
        } else {
          this.paginationInfo.totalItems = this.list.length;
        }
      },
      error: (_) => {
        this.list = [];
        this.paginationInfo.totalItems = 0;
      },
    });
  }

  loadListSP() {
    this.service.loadPaginatedSP(this.paginationParams, { ...this.filterModel! }).subscribe({
      next: (response) => {
        this.list = response.list || [];

        if (response.paginationInfo) {
          this.paginationInfoMap(response);
        } else {
          this.paginationInfo.totalItems = this.list.length;
        }
      },
      error: (_) => {
        this.list = [];
        this.paginationInfo.totalItems = 0;
      },
    });
  }

  search() {
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    this.loadList();
  }
  searchAndLoadSP() {
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    this.loadListSP();
  }

  resetSearch() {
    this.filterModel = {} as FilterModel;
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.loadList();
  }
  resetSearchAndLoadSP() {
    this.filterModel = {} as FilterModel;
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.loadListSP();
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    this.loadList();
  }
  onPageChangeLoadSP(event: PaginatorState) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    this.loadListSP();
  }

  exportExcel(fileName: string = 'data.xlsx'): void {
    this.service.loadPaginated(this.paginationParams, { ...this.filterModel! }).subscribe({
      next: (res) => {
        const data = res.list;
        if (data && data.length > 0) {
          const isRTL =
            this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC ? true : false;
          const transformedData = data.map((item) => this.mapModelToExcelRow(item));
          const ws = XLSX.utils.json_to_sheet(transformedData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          wb.Workbook = { Views: [{ RTL: isRTL }] };
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, fileName);
        }
      },
    });
  }

  protected abstract mapModelToExcelRow(model: Model): { [key: string]: any };

  protected paginationInfoMap(response: PaginatedList<Model>) {
    const paginationInfo = response.paginationInfo;
    this.paginationInfo.totalItems = paginationInfo.totalItems || 0;
    this.paginationParams.pageSize = paginationInfo.pageSize || 10;
    this.paginationParams.pageNumber = paginationInfo.currentPage || 1;

    this.rows = this.paginationParams.pageSize;
    this.first = (this.paginationParams.pageNumber - 1) * this.paginationParams.pageSize;
  }

  deleteModel(id: string | number) {
    const dialogRef = this.confirmService.open({
      icon: 'warning',
      messages: ['COMMON.CONFIRM_DELETE'],
      confirmText: 'COMMON.OK',
      cancelText: 'COMMON.CANCEL',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == DIALOG_ENUM.OK) {
        this.service.delete(id).subscribe({
          next: () => {
            this.loadList();
            this.alertsService.showSuccessMessage({ messages: ['COMMON.DELETED_SUCCESSFULLY'] });
          },
          error: (_) => {
            this.alertsService.showErrorMessage({ messages: ['COMMON.DELETION_FAILED'] });
          },
        });
      }
    });
  }

  deleteAndLoadSP(id: string | number) {
    const dialogRef = this.confirmService.open({
      icon: 'warning',
      messages: ['COMMON.CONFIRM_DELETE'],
      confirmText: 'COMMON.OK',
      cancelText: 'COMMON.CANCEL',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == DIALOG_ENUM.OK) {
        this.service.delete(id).subscribe({
          next: () => {
            this.loadListSP();
            this.alertsService.showSuccessMessage({ messages: ['COMMON.DELETED_SUCCESSFULLY'] });
          },
          error: (_) => {
            this.alertsService.showErrorMessage({ messages: ['COMMON.DELETION_FAILED'] });
          },
        });
      }
    });
  }
}
