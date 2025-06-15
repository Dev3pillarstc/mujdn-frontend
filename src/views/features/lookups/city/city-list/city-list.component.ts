import { BaseListComponent } from '@/components/base-list/base-list.component';
import { Component, Inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Breadcrumb } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CityService } from '@/services/features/lookups/city.service';

@Component({
  selector: 'app-city-list',
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss'
})
export default class CityListComponent extends BaseListComponent<CityListComponent>
  implements OnInit
{
   dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  service: CityService = Inject(CityService);

  override openDialog(): void {
    this.openBaseDialog(CityListComponent as any);
  }

  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  date2: Date | undefined;
  cities!: any[];
  first: number = 0;
  rows: number = 10;

  ngOnInit() {
    this.service.loadPaginated().subscribe((data) => {
      console.log('Cities loaded:', data);
      this.cities = data.list;
    });
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
}
