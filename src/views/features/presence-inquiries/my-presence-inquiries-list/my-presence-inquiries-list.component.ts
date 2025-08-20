import { CommonModule } from '@angular/common';
import { Component, inject, input, SimpleChanges } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { PresenceInquiriesPopupComponent } from '../presence-inquiries-popup/presence-inquiries-popup.component';
import { FormsModule } from '@angular/forms';
import { PresenceInquiryFilter } from '@/models/features/presence-inquiry/presence-inquiry-filter';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { PresenceInquiryService } from '@/services/features/presence-inquiry.service';
import { PresenceInquiry } from '@/models/features/presence-inquiry/presence-inquiry';
import { TranslatePipe } from '@ngx-translate/core';
import { USER_PRESENCE_INQUIRY_STATUS_ENUM } from '@/enums/user-presence-inquiry-status-enum';
import { UserPresenceInquiryStatusService } from '@/services/features/user-presence-inquiry-status.service';

@Component({
  selector: 'app-my-presence-inquiries-list',
  imports: [
    InputTextModule,
    CommonModule,
    PaginatorModule,
    Select,
    DatePickerModule,
    TabsModule,
    TableModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './my-presence-inquiries-list.component.html',
  styleUrl: './my-presence-inquiries-list.component.scss',
})
export class MyPresenceInquiriesListComponent extends BaseListComponent<
  PresenceInquiry,
  PresenceInquiriesPopupComponent,
  PresenceInquiryService,
  PresenceInquiryFilter
> {
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };

  presenceInquiryService = inject(PresenceInquiryService);
  filterModel: PresenceInquiryFilter = new PresenceInquiryFilter();
  userPresenceInquiryStatusService = inject(UserPresenceInquiryStatusService);
  userPresenceInquiryStatuses: BaseLookupModel[] = [];
  userInquiryStatusEnum = USER_PRESENCE_INQUIRY_STATUS_ENUM;
  isActive = input.required<boolean>();
  private hasInitialized: boolean = false;

  override get service() {
    return this.presenceInquiryService;
  }

  override initListComponent(): void {
    this.userPresenceInquiryStatusService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.userPresenceInquiryStatuses = res;
    });
  }

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'PRESENCE_INQUIRIES_PAGE.PRESENCE_INQUIRIES' }];
  }

  override openDialog(model: PresenceInquiry): void {}

  loadMyPresenceInquiriesList() {
    this.service
      .loadMyPresenceInquiriesPaginated(this.paginationParams, { ...this.filterModel! })
      .subscribe({
        next: (response) => {
          this.list = response.list || [];

          if (response.paginationInfo) {
            this.paginationInfoMap(response);
          } else {
            this.paginationInfo.totalItems = this.list.length;
          }
        },
        error: (_) => {
          this.list = [];
          this.paginationInfo.totalItems = 0;
        },
      });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isActive']) {
      const current = changes['isActive'].currentValue;
      const previous = changes['isActive'].previousValue;

      // Skip first trigger after component init
      if (!this.hasInitialized) {
        this.hasInitialized = true;
        return;
      }

      // Only load data if tab is active and this is not the initial change
      if (current === true && previous === false) {
        this.loadMyPresenceInquiriesList();
      }
    }
  }

  override search() {
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    this.loadMyPresenceInquiriesList();
  }

  override resetSearch() {
    this.filterModel = new PresenceInquiryFilter();
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.loadMyPresenceInquiriesList();
  }

  protected override mapModelToExcelRow(model: PresenceInquiry): { [key: string]: any } {
    return {
      // [this.translateService.instant('PRESENCE_INQUIRIES_PAGE.EMPLOYEE_NAME_AR')]: model.fullNameAr,
      // [this.translateService.instant('PRESENCE_INQUIRIES_PAGE.EMPLOYEE_NAME_EN')]: model.fullNameEn,
      // [this.translateService.instant('PRESENCE_INQUIRIES_PAGE.NATIONAL_ID')]: model.nationalId,
      // [this.translateService.instant('PRESENCE_INQUIRIES_PAGE.DEPARTMENT')]: model.departmentName,
      // [this.translateService.instant('PRESENCE_INQUIRIES_PAGE.STATUS')]: model.statusName,
    };
  }

  set dateFrom(value: Date | null) {
    this.filterModel.dateFrom = value;

    if (this.filterModel.dateTo && value && this.filterModel.dateTo < value) {
      this.filterModel.dateTo = null;
    }
  }

  get dateFrom(): Date | null | undefined {
    return this.filterModel.dateFrom;
  }

  getPropertyName() {
    return this.langService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH ? 'nameEn' : 'nameAr';
  }

  override onPageChange(event: PaginatorState, isStoredProcedure: boolean = false) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    this.loadMyPresenceInquiriesList();
  }
}
