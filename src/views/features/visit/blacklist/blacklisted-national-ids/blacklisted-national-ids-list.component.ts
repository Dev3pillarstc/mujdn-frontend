// blacklisted-national-ids-list.component.ts
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { BlacklistedNationalId } from '@/models/features/visit/blacklisted-national-id';
import { BlacklistedNationalIdFilter } from '@/models/features/visit/blacklisted-national-id-filter';
import { BlacklistedNationalIdService } from '@/services/features/visit/blacklisted-national-id.service';
import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlacklistedNationalIdsPopupComponent } from '../blacklisted-national-ids-popup/blacklisted-national-ids-popup.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-blacklisted-national-id-list',
  imports: [
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
  implements OnInit, OnChanges
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

  ngOnChanges(changes: SimpleChanges): void {
    // Watch for changes in isActive input
    if (changes['isActive'] && changes['isActive'].currentValue === true) {
      this.loadDataIfNeeded();
    }
  }

  private loadDataIfNeeded(): void {
    // Load data when tab becomes active
    this.loadList().subscribe({
      next: (response) => this.handleLoadListSuccess(response),
      error: this.handleLoadListError,
    });
  }

  override initListComponent(): void {}

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'BLACKLISTED_NATIONAL_IDS_PAGE.BLACKLISTED_NATIONAL_IDS_LIST' }];
  }

  override openDialog(model: BlacklistedNationalId): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(BlacklistedNationalIdsPopupComponent as any, model, viewMode);
  }

  addOrEditModel(blacklistedNationalId?: BlacklistedNationalId): void {
    blacklistedNationalId = blacklistedNationalId || new BlacklistedNationalId();
    this.openDialog(blacklistedNationalId);
  }

  protected override mapModelToExcelRow(model: BlacklistedNationalId): { [key: string]: any } {
    return {
      [this.translateService.instant('BLACKLIST_PAGE.NATIONAL_ID')]: model.nationalId,
    };
  }
}
