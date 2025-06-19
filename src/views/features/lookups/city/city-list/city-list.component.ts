import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { Breadcrumb } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CityService } from '@/services/features/lookups/city.service';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { CityPopupComponent } from '../city-popup/city-popup.component';
import { City } from '@/models/features/lookups/city/city';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CityFilter } from '@/models/features/lookups/city/city-filter';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-city-list',
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule, FormsModule, TranslatePipe],
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

  override openDialog(city: City): void {
    this.openBaseDialog(CityPopupComponent as any, city);
  }

  addOrEditModel(city?: City) {
    city = city || new City();
    this.openDialog(city);
  }
}
