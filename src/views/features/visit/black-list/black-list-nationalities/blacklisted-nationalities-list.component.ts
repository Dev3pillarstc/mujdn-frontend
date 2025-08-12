import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { BlacklistedNationality } from '@/models/features/visit/blacklisted-nationality';
import { BlacklistedNationalityFilter } from '@/models/features/visit/blacklisted-nationality-filter';
import { BlacklistedNationalityService } from '@/services/features/visit/blacklisted-nationality.service';
import { Component, inject, OnInit } from '@angular/core';
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
import { BlacklistedNationalityPopupComponent } from '../black-list-nationality-popup/blacklisted-nationality-popup.component';

@Component({
  selector: 'app-blacklisted-nationality-list',
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
  templateUrl: './blacklisted-nationalities-list.component.html',
  styleUrl: './blacklisted-nationalities-list.component.scss',
})
export class BlacklistedNationalityListComponent
  extends BaseListComponent<
    BlacklistedNationality,
    BlacklistedNationalityPopupComponent,
    BlacklistedNationalityService,
    BlacklistedNationalityFilter
  >
  implements OnInit
{
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  blacklistedNationalityService = inject(BlacklistedNationalityService);
  filterModel: BlacklistedNationalityFilter = new BlacklistedNationalityFilter();

  override get service() {
    return this.blacklistedNationalityService;
  }

  override initListComponent(): void {}

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'BLACKLISTED_NATIONALITIES_PAGE.BLACKLISTED_NATIONALITIES_LIST' }];
  }

  override openDialog(model: BlacklistedNationality): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(BlacklistedNationalityPopupComponent as any, model, viewMode);
  }

  addOrEditModel(blacklistedNationality?: BlacklistedNationality) {
    blacklistedNationality = blacklistedNationality || new BlacklistedNationality();
    this.openDialog(blacklistedNationality);
  }

  protected override mapModelToExcelRow(model: BlacklistedNationality): { [key: string]: any } {
    return {
      [this.translateService.instant('BLACKLISTED_NATIONALITIES_PAGE.NATIONALITY_IN_ARABIC')]:
        model.nameAr,
      [this.translateService.instant('BLACKLISTED_NATIONALITIES_PAGE.NATIONALITY_IN_ENGLISH')]:
        model.nameEn,
    };
  }
}
