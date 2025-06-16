import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { Breadcrumb } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CityService } from '@/services/features/lookups/city.service';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { CityPopupComponent } from '../city-popup/city-popup.component';
import { City } from '@/models/features/lookups/City/city';
import { ReactiveFormsModule } from '@angular/forms';
import { CityFilter } from '@/models/features/lookups/City/city-filter';

@Component({
  selector: 'app-city-list',
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule, ReactiveFormsModule],
  providers: [CityService],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss',
})
export default class CityListComponent
  extends BaseListComponent<City, CityPopupComponent, CityService, CityFilter>
  implements OnInit
{
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  cityService = inject(CityService);
  home: MenuItem | undefined;
  filterModel: CityFilter = new CityFilter();

  override get service() {
    return this.cityService;
  }

  override openDialog(): void {
    this.openBaseDialog(CityPopupComponent as any);
  }
}
