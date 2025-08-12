import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { AssignEmployeeResponsibilityPopupComponent } from '../assign-employee-responsibility-popup/assign-employee-responsibility-popup.component';
import { PresenceInquiriesPopupComponent } from '../presence-inquiries-popup/presence-inquiries-popup.component';
import { ViewEmployeesCheckPopupComponent } from '../view-employees-check-popup/view-employees-check-popup.component';
import { FormsModule } from '@angular/forms';
import { PresenceInquiryFilter } from '@/models/features/presence-inquiry/presence-inquiry-filter';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { UserProfilePresenceInquiry } from '@/models/features/presence-inquiry/user-profile-presence-inquiry';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { LanguageService } from '@/services/shared/language.service';
import { PresenceInquiryService } from '@/services/features/presence-inquiry.service';
import { PresenceInquiry } from '@/models/features/presence-inquiry/presence-inquiry';
import { TranslatePipe } from '@ngx-translate/core';
import { PermissionStatusService } from '@/services/features/lookups/permission-status.service';
import { PresenceInquiryStatusService } from '@/services/features/presence-inquiry-status.service';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { USER_PRESENCE_INQUIRY_STATUS_ENUM } from '@/enums/user-presence-inquiry-status-enum';
interface Adminstration {
  type: string;
}

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
  departments: BaseLookupModel[] = [];
  departmentService = inject(DepartmentService);
  presenceInquiryStatusService = inject(PresenceInquiryStatusService);
  presenceInquiryStatuses: BaseLookupModel[] = [];
  inquiryStatusEnum = USER_PRESENCE_INQUIRY_STATUS_ENUM;

  override get service() {
    return this.presenceInquiryService;
  }

  override initListComponent(): void {
    this.presenceInquiryStatusService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.presenceInquiryStatuses = res;
    });
  }

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'PRESENCE_INQUIRIES_PAGE.PRESENCE_INQUIRIES' }];
  }

  override openDialog(model: PresenceInquiry): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(PresenceInquiriesPopupComponent as any, model, viewMode);
  }
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

  addOrEditModel(presenceInquiry?: PresenceInquiry): void {
    this.openDialog(presenceInquiry ?? new PresenceInquiry());
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
}
