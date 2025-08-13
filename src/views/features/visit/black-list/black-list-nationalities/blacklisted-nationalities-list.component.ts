// blacklisted-nationalities-list.component.ts
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { BlacklistedNationality } from '@/models/features/visit/blacklisted-nationality';
import { BlacklistedNationalityFilter } from '@/models/features/visit/blacklisted-nationality-filter';
import { BlacklistedNationalityService } from '@/services/features/visit/blacklisted-nationality.service';
import { Component, inject, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { RouterModule } from '@angular/router';
import { BlacklistedNationalityPopupComponent } from '../black-list-nationality-popup/blacklisted-nationality-popup.component';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-blacklisted-nationality-list',
  imports: [
    Breadcrumb,
    TableModule,
    PaginatorModule,
    InputTextModule,
    FormsModule,
    TranslatePipe,
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
  implements OnInit, OnChanges
{
  @Input() isActive: boolean = false;
  @Input() nationalities: BaseLookupModel[] = [];
  @Input() initialData: PaginatedList<BlacklistedNationality> | null = null;

  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };

  blacklistedNationalityService = inject(BlacklistedNationalityService);
  filterModel: BlacklistedNationalityFilter = new BlacklistedNationalityFilter();

  private hasInitializedFromData = false;

  override get service() {
    return this.blacklistedNationalityService;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle initial data changes from parent
    if (changes['initialData'] && this.initialData && !this.hasInitializedFromData) {
      this.initializeFromInitialData();
    }
  }

  override ngOnInit(): void {
    // Override the base ngOnInit to prevent automatic data loading
    this.setHomeItem();
    this.initListComponent();

    // Initialize from initial data if available
    if (this.initialData && !this.hasInitializedFromData) {
      this.initializeFromInitialData();
    }

    // Listen to language changes
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setHomeItem();
    });
  }

  private initializeFromInitialData(): void {
    if (!this.initialData) return;

    this.handleLoadListSuccess(this.initialData);
    this.hasInitializedFromData = true;
  }

  override initListComponent(): void {
    // Any additional initialization logic specific to nationality list
  }

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'BLACKLISTED_NATIONALITIES_PAGE.BLACKLISTED_NATIONALITIES_LIST' }];
  }

  override openDialog(model: BlacklistedNationality): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(BlacklistedNationalityPopupComponent as any, model, viewMode, {
      nationalities: this.nationalities,
    });
  }

  addOrEditModel(blacklistedNationality?: BlacklistedNationality): void {
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
