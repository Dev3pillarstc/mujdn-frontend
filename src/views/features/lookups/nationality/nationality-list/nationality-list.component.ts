import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { NationalityPopupComponent } from '@/views/features/lookups/nationality/nationality-popup/nationality-popup.component';
import { NationalityService } from '@/services/features/lookups/nationality.service';
import { NationalityFilter } from '@/models/features/lookups/Nationality-filter';
import { Nationality } from '@/models/features/lookups/Nationality';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { ActivatedRoute } from '@angular/router';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginationInfo } from '@/models/shared/response/pagination-info';
import { PaginationParams } from '@/models/shared/pagination-params';
import { catchError, of } from 'rxjs';
import { OptionsContract } from '@/contracts/options-contract';

@Component({
  selector: 'app-nationality-list',
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule, FormsModule, TranslatePipe],
  templateUrl: './nationality-list.component.html',
  styleUrl: './nationality-list.component.scss',
})
export default class NationalityListComponent
  extends BaseListComponent<NationalityPopupComponent>
  implements OnInit
{
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  activatedRoute = inject(ActivatedRoute);
  nationalityService = inject(NationalityService);
  declare paginationInfo: PaginationInfo;
  paginationParams: PaginationParams = new PaginationParams();
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  list: Nationality[] = [];
  // Pagination properties
  first: number = 0;
  rows: number = 10;
  // Filter properties
  filterModel: NationalityFilter = new NationalityFilter();

  override openDialog(): void {
    this.openBaseDialog(NationalityPopupComponent as any);
  }

  ngOnInit() {
    this.list = this.activatedRoute.snapshot.data['list'].list;
    this.paginationInfo = this.activatedRoute.snapshot.data['list'].paginationInfo;
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'قائمة الجنسيات' }];
  }

  loadList() {
    this.nationalityService
      .loadPaginated(this.paginationParams, { ...this.filterModel })
      .subscribe({
        next: (response) => {
          this.list = response.list || [];

          if (response.paginationInfo) {
            this.paginationInfoMap(response);
          } else {
            this.paginationInfo.totalItems = this.list.length;
          }
        },
        error: (error) => {
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

  resetSearch() {
    this.filterModel = new NationalityFilter();
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

  private paginationInfoMap(response: PaginatedList<Nationality>) {
    const paginationInfo = response.paginationInfo;
    this.paginationInfo.totalItems = paginationInfo.totalItems || 0;
    this.paginationParams.pageSize = paginationInfo.pageSize || 10;
    this.paginationParams.pageNumber = paginationInfo.currentPage || 1;

    this.rows = this.paginationParams.pageSize;
    this.first = (this.paginationParams.pageNumber - 1) * this.paginationParams.pageSize;
  }
}
