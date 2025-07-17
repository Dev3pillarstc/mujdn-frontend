import { Directive, inject, OnDestroy, OnInit } from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

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

  paginationInfo: PaginationInfo = new PaginationInfo();
  abstract breadcrumbs: MenuItem[] | undefined;
  list: Model[] = [];
  paginationParams: PaginationParams = new PaginationParams();
  matDialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);
  langService = inject(LanguageService);
  confirmService = inject(ConfirmationService);
  alertsService = inject(AlertService);
  tanslateService = inject(TranslateService);
  declare selectedModel?: Model;

  abstract get filterModel(): FilterModel;

  abstract set filterModel(val: FilterModel);

  abstract get service(): TService;

  abstract openDialog(nationality: Model): void;

  abstract initListComponent(): void;
  home = {
    label: this.tanslateService.instant('COMMON.HOME'),
    icon: 'pi pi-home',
    routerLink: '/home',
  };
  private langChangeSub!: Subscription;

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
  setHomeItem(): void {
    this.home = {
      label: this.tanslateService.instant('COMMON.HOME'),
      icon: 'pi pi-home',
      routerLink: '/home',
    };
  }
  ngOnInit() {
    this.setHomeItem();
    this.list = this.activatedRoute.snapshot.data['list']?.list;
    this.paginationInfo = this.activatedRoute.snapshot.data['list']?.paginationInfo;
    this.initListComponent();
    // Listen to language changes
    this.langChangeSub = this.tanslateService.onLangChange.subscribe(() => {
      this.setHomeItem();
    });
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

  search(isStoredProcedure: boolean = false) {
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    if (isStoredProcedure) {
      this.loadListSP();
    } else {
      this.loadList();
    }
  }

  resetSearch(isStoredProcedure: boolean = false) {
    this.filterModel = {} as FilterModel;
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    if (isStoredProcedure) {
      this.loadListSP();
    } else {
      this.loadList();
    }
  }

  onPageChange(event: PaginatorState, isStoredProcedure: boolean = false) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    if (isStoredProcedure) {
      this.loadListSP();
    } else {
      this.loadList();
    }
  }

  exportExcel(fileName: string = 'data.xlsx'): void {
    if (this.list && this.list.length > 0) {
      const isRTL = this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC ? true : false;
      const transformedData = this.list.map((item) => this.mapModelToExcelRow(item));
      const ws = XLSX.utils.json_to_sheet(transformedData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      wb.Workbook = { Views: [{ RTL: isRTL }] };
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, fileName);
    }
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

  deleteModel(id: string | number, isStoredProcedure: boolean = false) {
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
            if (isStoredProcedure) {
              this.loadListSP();
            } else {
              this.loadList();
            }
            this.alertsService.showSuccessMessage({ messages: ['COMMON.DELETED_SUCCESSFULLY'] });
          },
        });
      }
    });
  }
  ngOnDestroy(): void {
    // ✅ Clean up the subscription
    if (this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
  }
}
