import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { Region } from '@/models/features/lookups/region/region';
import { RegionFilter } from '@/models/features/lookups/region/region-filter';
import { RegionService } from '@/services/features/lookups/region.service';
import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RegionPopupComponent } from '../region-popup/region-popup.component';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LanguageService } from '@/services/shared/language.service';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-region-list',
  imports: [
    Breadcrumb,
    TableModule,
    PaginatorModule,
    InputTextModule,
    FormsModule,
    TranslatePipe,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './region-list.component.html',
  styleUrl: './region-list.component.scss',
})
export class RegionListComponent
  extends BaseListComponent<Region, RegionPopupComponent, RegionService, RegionFilter>
  implements OnInit
{
  translateService = inject(TranslateService);
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  regionService = inject(RegionService);
  override breadcrumbs: MenuItem[] | undefined;
  filterModel: RegionFilter = new RegionFilter();

  override get service() {
    return this.regionService;
  }

  override initListComponent(): void {
    this.breadcrumbs = [{ label: 'REGIONS_PAGE.REGIONS_LIST' }];
  }

  override openDialog(model: Region): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(RegionPopupComponent as any, model, viewMode);
  }

  addOrEditModel(region?: Region) {
    region = region || new Region();
    this.openDialog(region);
  }

  protected override mapModelToExcelRow(model: Region): { [key: string]: any } {
    return {
      [this.translateService.instant('REGIONS_PAGE.REGION_IN_ARABIC')]: model.nameAr,
      [this.translateService.instant('REGIONS_PAGE.REGION_IN_ENGLISH')]: model.nameEn,
    };
  }
}
