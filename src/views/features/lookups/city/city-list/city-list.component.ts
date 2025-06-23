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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CityFilter } from '@/models/features/lookups/City/city-filter';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { Region } from '@/models/features/lookups/region/region';
import { RegionService } from '@/services/features/lookups/region.service';

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
  languageService = inject(LanguageService); // Assuming you have a LanguageService to handle language changes
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  cityService = inject(CityService);
  home: MenuItem | undefined;
  filterModel: CityFilter = new CityFilter();
  regions: Region[] = [];
  regionService = inject(RegionService);

  override get service() {
    return this.cityService;
  }

  override initListComponent(): void {
    this.regionService.load().subscribe((res: Region[]) => {
      this.regions = res;
    });
  }

  override openDialog(city: City): void {
    const lookups = { regions: this.regions };
    this.openBaseDialog(CityPopupComponent as any, city, lookups);
  }

  addOrEditModel(city?: City) {
    city = city || new City();
    this.openDialog(city);
  }

  protected override mapModelToExcelRow(model: City): { [key: string]: any } {
    const lang = this.languageService.getCurrentLanguage(); // 'ar' or 'en'
    return {
      [lang === LANGUAGE_ENUM.ARABIC ? 'المدينة' : 'City']:
        lang === LANGUAGE_ENUM.ARABIC ? model.nameAr : model.nameEn,
    };
  }
}
