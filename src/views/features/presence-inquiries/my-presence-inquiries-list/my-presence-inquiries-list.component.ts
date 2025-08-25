import { CommonModule, DatePipe } from '@angular/common';
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
import { LanguageService } from '@/services/shared/language.service';
import { CustomValidators } from '@/validators/custom-validators';
import * as XLSX from 'xlsx';

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
  providers: [DatePipe],
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
  languageService = inject(LanguageService);
  datePipe = inject(DatePipe);
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
    console.log(model);

    const date =
      typeof model.assignedDate === 'string' ? new Date(model.assignedDate) : model.assignedDate;
    return {
      [this.translateService.instant('INQUIRIES_PAGE.INQUIRY_DATE')]: this.formatDate(
        model.assignedDate
      ),

      [this.translateService.instant('INQUIRIES_PAGE.INQUIRY_TIME')]: this.formatTime(
        model.assignedDate
      ),
      [this.translateService.instant('INQUIRIES_PAGE.ALLOWED_ATTENDANCE_PERIOD')]: model.buffer,
      [this.translateService.instant('INQUIRIES_PAGE.PROCESSING_STATUS')]: this.getStatusName(
        model.assignedUsers?.[0]?.inquiryStatusId ?? 0
      ),
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
  getStatusName(id: number): string {
    const status = this.userPresenceInquiryStatuses.find((d) => d.id === id);
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (status?.nameEn ?? '')
      : (status?.nameAr ?? '');
  }
  override onPageChange(event: PaginatorState) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    this.loadMyPresenceInquiriesList();
  }
  formatDate(date: string | Date | null | undefined): string {
    if (!date) return '-'; // fallback when no date
    const d = new Date(date);
    return this.datePipe.transform(d, 'dd-MM-yyyy') ?? '-';
  }

  formatTime(date: string | Date | null | undefined): string {
    if (!date) return '-';
    const d = new Date(date);
    return this.datePipe.transform(d, 'HH:mm:ss') ?? '-';
  }
  override exportExcel(
    fileName: string = 'MyPresenceProofInquiry.xlsx',
    isIncomingPermissions: boolean = false
  ): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
    };

    const fetchAll = this.service.loadMyPresenceInquiriesPaginated(allDataParams, {
      ...this.filterModel!,
    });

    fetchAll.subscribe({
      next: (response) => {
        const fullList = response.list || [];
        if (fullList.length > 0) {
          const isRTL = this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC;
          const transformedData = fullList.map((item) =>
            isIncomingPermissions ? this.mapModelToExcelRow(item) : this.mapModelToExcelRow(item)
          );
          const ws = XLSX.utils.json_to_sheet(transformedData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          wb.Workbook = { Views: [{ RTL: isRTL }] };
          XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
          XLSX.writeFile(wb, fileName);
        }
      },
      error: (_) => {
        this.alertsService.showErrorMessage({ messages: ['COMMON.ERROR'] });
      },
    });
  }
}
