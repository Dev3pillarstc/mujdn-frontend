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
  declare paginationInfo: PaginationInfo;
  items: MenuItem[] | undefined;
  list: Model[] = [];
  paginationParams: PaginationParams = new PaginationParams();
  matDialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);
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

  ngOnInit() {
    this.list = this.activatedRoute.snapshot.data['list'].list;
    this.paginationInfo = this.activatedRoute.snapshot.data['list'].paginationInfo;
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'قائمة الجنسيات' }];
    this.initListComponent();
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

  search() {
    console.log(this.filterModel);
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    this.loadList();
  }

  resetSearch() {
    this.filterModel = new NationalityFilter() as FilterModel;
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.loadList();
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    this.loadList();
  }

  exportExcel(fileName: string = 'data.xlsx'): void {
    this.service.loadPaginated(this.paginationParams, { ...this.filterModel! }).subscribe({
      next: (res) => {
        const data = res.list;
        if (data && data.length > 0) {
          const transformedData = data.map((item) => this.mapModelToExcelRow(item));
          const ws = XLSX.utils.json_to_sheet(transformedData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          wb.Workbook = { Views: [{ RTL: true }] };
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, fileName);
        }
      },
    });
  }

  // Inside BaseListComponent
  protected abstract mapModelToExcelRow(model: Model): { [key: string]: any };

  private paginationInfoMap(response: PaginatedList<Model>) {
    const paginationInfo = response.paginationInfo;
    this.paginationInfo.totalItems = paginationInfo.totalItems || 0;
    this.paginationParams.pageSize = paginationInfo.pageSize || 10;
    this.paginationParams.pageNumber = paginationInfo.currentPage || 1;

    this.rows = this.paginationParams.pageSize;
    this.first = (this.paginationParams.pageNumber - 1) * this.paginationParams.pageSize;
  }
}
