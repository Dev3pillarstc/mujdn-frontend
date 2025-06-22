import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { Region } from '@/models/features/lookups/region/region';
import { RegionFilter } from '@/models/features/lookups/region/region-filter';
import { RegionService } from '@/services/features/lookups/region.service';
import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RegionPopupComponent } from '../region-popup/region-popup.component';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-region-list',
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule, FormsModule, TranslatePipe],
  templateUrl: './region-list.component.html',
  styleUrl: './region-list.component.scss',
})
export class RegionListComponent
  extends BaseListComponent<Region, RegionPopupComponent, RegionService, RegionFilter>
  implements OnInit
{
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  regionService = inject(RegionService);
  home: MenuItem | undefined;
  filterModel: RegionFilter = new RegionFilter();

  override get service() {
    return this.regionService;
  }

  override openDialog(region: Region): void {
    this.openBaseDialog(RegionPopupComponent as any, region);
  }

  addOrEditModel(region?: Region) {
    region = region || new Region();
    this.openDialog(region);
  }
}
