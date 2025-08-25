import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input, model, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { PresenceInquiriesPopupComponent } from '../presence-inquiries-popup/presence-inquiries-popup.component';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { USER_PRESENCE_INQUIRY_STATUS_ENUM } from '@/enums/user-presence-inquiry-status-enum';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { PresenceInquiry } from '@/models/features/presence-inquiry/presence-inquiry';
import { PresenceInquiryFilter } from '@/models/features/presence-inquiry/presence-inquiry-filter';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { PresenceInquiryStatusService } from '@/services/features/presence-inquiry-status.service';
import { PresenceInquiryService } from '@/services/features/presence-inquiry.service';
import { TranslatePipe } from '@ngx-translate/core';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { MatDialogConfig } from '@angular/material/dialog';
import { filter, of, switchMap, takeUntil, tap } from 'rxjs';
import { PRESENCE_INQUIRY_STATUS_ENUM } from '@/enums/presence-inquiry-status-enum';
import { AssignEmployeeResponsibilityPopupComponent } from '../assign-employee-responsibility-popup/assign-employee-responsibility-popup.component';
import { ViewEmployeesCheckPopupComponent } from '../view-employees-check-popup/view-employees-check-popup.component';
import { UserProfileService } from '@/services/features/user-profile.service';
import { UserProfilePresenceInquiry } from '@/models/features/presence-inquiry/user-profile-presence-inquiry';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import * as XLSX from 'xlsx';
import { CustomValidators } from '@/validators/custom-validators';
import { LanguageService } from '@/services/shared/language.service';

@Component({
  selector: 'app-others-presence-inquiries-list',
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
  templateUrl: './others-presence-inquiries-list.component.html',
  styleUrl: './others-presence-inquiries-list.component.scss',
})
export class OthersPresenceInquiriesListComponent extends BaseListComponent<
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
  userProfileService = inject(UserProfileService);
  presenceInquiryStatusService = inject(PresenceInquiryStatusService);
  presenceInquiryStatuses: BaseLookupModel[] = [];
  inquiryStatusEnum = PRESENCE_INQUIRY_STATUS_ENUM;
  isActive = input.required<boolean>();
  datePipe = inject(DatePipe);
  languageService = inject(LanguageService);

  override get service() {
    return this.presenceInquiryService;
  }

  override initListComponent(): void {
    this.presenceInquiryStatusService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.presenceInquiryStatuses = res;
    });
    this.departmentService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.departments = res;
    });
  }
  override openBaseDialog(
    popupComponent: PresenceInquiriesPopupComponent,
    model: PresenceInquiry,
    viewMode: ViewModeEnum,
    lookups?: {
      [key: string]: any[];
    }
  ) {
    const clonedModel = Object.assign(Object.create(Object.getPrototypeOf(model)), model);
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: clonedModel,
      lookups: lookups,
      viewMode: viewMode,
    };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    const dialogRef = this.matDialog.open(popupComponent as any, dialogConfig);

    return dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: DIALOG_ENUM) => {
        if (result && result == DIALOG_ENUM.OK) {
          this.loadPresenceInquiriesList();
        }
      });
  }
  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'PRESENCE_INQUIRIES_PAGE.PRESENCE_INQUIRIES' }];
  }

  override openDialog(model: PresenceInquiry): void {
    const viewMode = model.id ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialog(PresenceInquiriesPopupComponent as any, model, viewMode);
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Watch for changes in isActive input
    if (changes['isActive'] && changes['isActive'].currentValue === true) {
      this.loadPresenceInquiriesList();
    }
  }

  loadPresenceInquiriesList() {
    this.service
      .loadPresenceInquiriesPaginated(this.paginationParams, { ...this.filterModel! })
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
  override onPageChange(event: PaginatorState) {
    this.first = event.first!;
    this.rows = event.rows!;
    this.paginationParams.pageNumber = Math.floor(this.first / this.rows) + 1;
    this.paginationParams.pageSize = this.rows;
    this.loadPresenceInquiriesList();
  }
  override search() {
    this.paginationParams.pageNumber = 1;
    this.first = 0;
    this.loadPresenceInquiriesList();
  }

  override resetSearch() {
    this.filterModel = new PresenceInquiryFilter();
    this.paginationParams.pageNumber = 1;
    this.paginationParams.pageSize = 10;
    this.first = 0;
    this.loadPresenceInquiriesList();
  }

  addOrEditModel(presenceInquiry?: PresenceInquiry): void {
    this.openDialog(presenceInquiry ?? new PresenceInquiry());
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
        model.statusId ?? 0
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
  openModal(id: number) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = { id: id };
    dialogConfig.width = '100%';
    dialogConfig.maxWidth = '1024px';
    const dialogRef = this.matDialog.open(AssignEmployeeResponsibilityPopupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      if (result && result == DIALOG_ENUM.OK) {
        this.loadPresenceInquiriesList();
      }
    });
  }
  openDataModal(model: PresenceInquiry) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = { model: model };
    dialogConfig.width = '100%';
    dialogConfig.maxWidth = '1024px';
    const dialogRef = this.matDialog.open(ViewEmployeesCheckPopupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      if (result && result == DIALOG_ENUM.OK) {
        this.loadPresenceInquiriesList();
      }
    });
  }
  override deleteModel(id: number) {
    const dialogRef = this.confirmService.open({
      icon: 'warning',
      messages: ['COMMON.CONFIRM_DELETE'],
      confirmText: 'COMMON.OK',
      cancelText: 'COMMON.CANCEL',
    });

    dialogRef
      .afterClosed()
      .pipe(
        takeUntil(this.destroy$),
        filter((result) => result === DIALOG_ENUM.OK),
        switchMap(() => this.service.delete(id)),
        tap(() => {
          this.loadPresenceInquiriesList(); // Just trigger the side effect
        })
      )
      .subscribe({
        next: () => {}, // No response expected since loadPresenceInquiriesList() handles updates
        error: this.handleLoadListError,
      });
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
  getStatusName(id: number): string {
    const status = this.presenceInquiryStatuses.find((d) => d.id === id);
    return this.languageService?.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
      ? (status?.nameEn ?? '')
      : (status?.nameAr ?? '');
  }
  override exportExcel(
    fileName: string = 'PresenceProofInquiry.xlsx',
    isIncomingPermissions: boolean = false
  ): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX,
    };

    const fetchAll = this.service.loadPresenceInquiriesPaginated(allDataParams, {
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
