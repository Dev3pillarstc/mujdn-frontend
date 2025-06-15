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

  override openDialog(): void {
    this.openBaseDialog(NationalityPopupComponent as any);
  }

  nationalityService = inject(NationalityService);
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  date2: Date | undefined;

  // Data properties
  nationalities: Nationality[] = [];

  // Pagination properties
  first: number = 0;
  rows: number = 10;
  pageNumber: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;

  // Sorting properties
  orderBy: string = 'NameEn';
  sortDir: string = 'asc';

  // Filter properties
  filterModel: NationalityFilter = new NationalityFilter();

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'قائمة الجنسيات' }];
    this.getAllNationalities();
  }

  getAllNationalities() {
    this.nationalityService
      .getAllNationalities(
        this.pageNumber,
        this.pageSize,
        this.orderBy,
        this.sortDir,
        this.filterModel
      )
      .subscribe({
        next: (response) => {
          this.nationalities = response.data.list || [];

          if (response.data.paginationInfo) {
            this.paginationInfoMap(response);
          } else {
            this.totalRecords = this.nationalities.length;
          }
        },
        error: (error) => {
          this.nationalities = [];
          this.totalRecords = 0;
        },
      });
  }

  private paginationInfoMap(response: PaginatedListResponseData<Nationality>) {
    const paginationInfo = response.data.paginationInfo;
    this.totalRecords = paginationInfo.totalItems || 0;
    this.pageSize = paginationInfo.pageSize || 10;
    this.pageNumber = paginationInfo.currentPage || 1;

    this.rows = this.pageSize;
    this.first = (this.pageNumber - 1) * this.pageSize;
  }

  search() {
    this.pageNumber = 1;
    this.first = 0;
    this.getAllNationalities();
  }

  resetSearch() {
    this.filterModel = new NationalityFilter();
    this.pageNumber = 1;
    this.pageSize = 10;
    this.first = 0;
    this.getAllNationalities();
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.pageSize = this.rows;
    this.getAllNationalities();
  }
}
