import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';
import { Breadcrumb } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CityService } from '@/services/features/lookups/city.service';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { CityPopupComponent } from '../city-popup/city-popup.component';
import { City } from '@/models/features/lookups/city/city';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RegionService } from '@/services/features/lookups/region.service';
import { CityFilter } from '@/models/features/lookups/city/city-filter';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';

@Component({
  selector: 'app-city-list',
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule, FormsModule, TranslatePipe],
  providers: [CityService],
  templateUrl: './city-list.component.html',
  styleUrl: './city-list.component.scss',
})
export default class CityListComponent extends BaseListComponent<
  City,
  CityPopupComponent,
  CityService,
  CityFilter
> {
  translateService = inject(TranslateService);
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  cityService = inject(CityService);
  home: MenuItem | undefined;
  filterModel: CityFilter = new CityFilter();
  regions: BaseLookupModel[] = [];
  regionService = inject(RegionService);

  override get service() {
    return this.cityService;
  }

  override initListComponent(): void {
    this.regionService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.regions = res;
    });
  }

  override openDialog(model: City): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    const lookups = { regions: this.regions };
    this.openBaseDialog(CityPopupComponent as any, model, viewMode, lookups);
  }

  addOrEditModel(city?: City): void {
    this.openDialog(city ?? new City());
  }

  protected override mapModelToExcelRow(model: City): { [key: string]: any } {
    return {
      [this.translateService.instant('CITIES_PAGE.CITY')]: model.getName(),
    };
  }
}
