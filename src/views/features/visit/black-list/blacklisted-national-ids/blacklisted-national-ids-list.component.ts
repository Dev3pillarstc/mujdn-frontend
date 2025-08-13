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
import { BlacklistedNationalIdsPopupComponent } from '../black-list-national-ids-popup/blacklisted-national-ids-popup.component';
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
  @Input() shouldInitialize: boolean = false;

  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };

  blacklistedNationalIdService = inject(BlacklistedNationalIdService);
  filterModel: BlacklistedNationalIdFilter = new BlacklistedNationalIdFilter();

  private hasLoadedData = false;

  override get service() {
    return this.blacklistedNationalIdService;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Load data when shouldInitialize becomes true and we haven't loaded yet
    if (
      changes['shouldInitialize'] &&
      this.shouldInitialize &&
      this.isActive &&
      !this.hasLoadedData
    ) {
      this.loadInitialData();
    }
  }

  override ngOnInit(): void {
    this.initListComponent();

    // Only load data if we should initialize and are active
    if (this.shouldInitialize && this.isActive && !this.hasLoadedData) {
      this.loadInitialData();
    }
  }

  private loadInitialData(): void {
    if (this.hasLoadedData) return;

    this.loadList().subscribe({
      next: (response) => {
        this.handleLoadListSuccess(response);
        this.hasLoadedData = true;
      },
      error: (error) => {
        console.error('Error loading national ID data:', error);
        this.handleLoadListError();
      },
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
      [this.translateService.instant('BLACKLISTED_NATIONAL_IDS_PAGE.NATIONAL_ID')]:
        model.nationalId,
    };
  }
}
