import { Component, inject, OnInit } from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { DevicesLocationModalComponent } from '../devices-location-modal/devices-location-modal.component';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { AccessLocationService } from '@/services/features/business/access-location.service';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { AccessLocation } from '@/models/features/business/access-location';

@Component({
  selector: 'app-devices-location',
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule, FormsModule, TranslatePipe],
  templateUrl: './devices-location.component.html',
  styleUrl: './devices-location.component.scss',
})
export default class DevicesLocationComponent
  extends BaseListComponent<
    AccessLocation,
    DevicesLocationModalComponent,
    AccessLocationService,
    BaseLookupModel
  >
  implements OnInit
{
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  accessLocationService = inject(AccessLocationService);
  filterModel: BaseLookupModel = new BaseLookupModel();

  override get service() {
    return this.accessLocationService;
  }

  override initListComponent(): void {}

  override openDialog(model: AccessLocation): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(DevicesLocationModalComponent as any, model, viewMode);
  }

  addOrEditModel(devicesLocation?: AccessLocation): void {
    this.openDialog(devicesLocation ?? new AccessLocation());
  }

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'DEVICES_LOCATION_PAGE.DEVICES_LOCATION_LIST' }];
  }

  protected override mapModelToExcelRow(model: AccessLocation): { [key: string]: any } {
    return {
      [this.translateService.instant('DEVICES_LOCATION_PAGE.DEVICE_LOCATION_IN_ARABIC')]:
        model.nameAr,
      [this.translateService.instant('DEVICES_LOCATION_PAGE.DEVICE_LOCATION_IN_ENGLISH')]:
        model.nameEn,
    };
  }
}
