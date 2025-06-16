import { Component, inject, Inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Breadcrumb } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CityService } from '@/services/features/lookups/city.service';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { CityPopupComponent } from '../city-popup/city-popup.component';
import { PaginationInfo } from '@/models/shared/response/pagination-info';
import { City } from '@/models/features/lookups/city';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-city-list',
  imports: [
    Breadcrumb,
    TableModule,
    PaginatorModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  providers: [CityService],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss',
})
export default class CityListComponent
  extends BaseListComponent<CityListComponent>
  implements OnInit
{
  override openDialog(): void {
    this.openBaseDialog(CityPopupComponent as any);
  }
  dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  date2: Date | undefined;
  cities!: any[];
  first: number = 0;
  rows: number = 10;
  list: City[] = [];
  matDialog: MatDialog = inject(MatDialog);
  service = inject(CityService);
  fb: FormBuilder = inject(FormBuilder);
  excelFileName: string = 'Cities.xlsx';
  totalPage: number = 0;
  totalRows: number = 0;
  paginationObj = new PaginationInfo();
  searchObj: {
    name?: string;
    fkCountryId?: number;
    fkRegionId?: number;
    isActive?: boolean;
  } = {
    name: undefined,
    fkRegionId: undefined,
    isActive: undefined,
    fkCountryId: undefined,
  };
  ngOnInit() {
    this.loadList();

    this.items = [{ label: 'لوحة المعلومات' }, { label: 'قائمة المدن' }];
    // Updated dummy data to match your Arabic table structure
    this.cities = [
      {
        cityAr: 'اسم المدينة',
        cityEn: 'city name',
      },
      {
        cityAr: 'اسم المدينة',
        cityEn: 'city name',
      },
    ];
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  loadList() {
    this.service.loadPaginated().subscribe({
      next: (result) => {
        if (result.list && result.list.length > 0) {
          this.list = result.list;
          let pagingInfo = result.paginationInfo;
          this.totalPage = pagingInfo.totalPages;
          this.totalRows = pagingInfo.totalItems;
        } else {
          this.list = [];
          this.totalPage = 0;
          this.totalRows = 0;
        }
      },
      error: (err) => {
        // AppSweetAlert.error();
      },
    });
  }
}
