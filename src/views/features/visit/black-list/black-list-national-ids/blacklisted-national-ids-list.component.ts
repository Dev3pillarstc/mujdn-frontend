import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { BlacklistedNationalId } from '@/models/features/visit/blacklisted-national-id';
import { BlacklistedNationalIdFilter } from '@/models/features/visit/blacklisted-national-id-filter';
import { BlacklistedNationalIdService } from '@/services/features/visit/blacklisted-national-id.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlacklistedNationalIdsPopupComponent } from '../black-list-national-ids-popup/blacklisted-national-ids-popup.component';

@Component({
  selector: 'app-blacklisted-national-id-list',
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
  templateUrl: './blacklisted-national-ids-list.component.html',
  styleUrl: './blacklisted-national-ids-list.component.scss',
})
export class BlacklistedNationalIdListComponent
  extends BaseListComponent<
    BlacklistedNationalId,
    BlacklistedNationalIdsPopupComponent,
    BlacklistedNationalIdService,
    BlacklistedNationalIdFilter
  >
  implements OnInit
{
  @Input() isActive: boolean = false;
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  blacklistedNationalIdService = inject(BlacklistedNationalIdService);
  filterModel: BlacklistedNationalIdFilter = new BlacklistedNationalIdFilter();

  override get service() {
    return this.blacklistedNationalIdService;
  }

  override initListComponent(): void {}

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'BLACKLISTED_NATIONAL_IDS_PAGE.BLACKLISTED_NATIONAL_IDS_LIST' }];
  }

  override openDialog(model: BlacklistedNationalId): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(BlacklistedNationalIdsPopupComponent as any, model, viewMode);
  }

  addOrEditModel(blacklistedNationalId?: BlacklistedNationalId) {
    blacklistedNationalId = blacklistedNationalId || new BlacklistedNationalId();
    this.openDialog(blacklistedNationalId);
  }

  protected override mapModelToExcelRow(model: BlacklistedNationalId): { [key: string]: any } {
    return {
      [this.translateService.instant('BLACKLISTED_NATIONAL_IDS_PAGE.NATIONAL_ID')]:
        model.nationalId,
    };
  }
}
