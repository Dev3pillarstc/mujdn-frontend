import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MatDialogConfig } from '@angular/material/dialog';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { ConfirmationService } from '@/services/shared/confirmation.service';
import { AlertService } from '@/services/shared/alert.service';
import { AttendanceLogPopupComponent } from '../attendance-log-popup/attendance-log-popup.component';
import { AttendanceService } from '@/services/features/attendance-log.service';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { InputTextModule } from 'primeng/inputtext';
import { LanguageService } from '@/services/shared/language.service';
import { ViewModeEnum } from '@/enums/view-mode-enum';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { UserService } from '@/services/features/user.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { AttendanceLog } from '@/models/features/attendance/attendance-log/attendance-log';
import { AttendanceLogFilter } from '@/models/features/attendance/attendance-log/attendance-log-filter';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { BooleanOptionModel } from '@/models/shared/boolean-option';
import { PROCESSING_STATUS_OPTIONS } from '@/models/shared/processing-status-option';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { registerIBMPlexArabicFont } from '../../../../../public/assets/fonts/ibm-plex-font';
import { formatSwipeTime } from '@/utils/general-helper';
import { CustomValidators } from '@/validators/custom-validators';

@Component({
  selector: 'app-others-attendance-log-list',
  imports: [
    FormsModule,
    Select,
    DatePickerModule,
    FluidModule,
    TableModule,
    CommonModule,
    RouterModule,
    SplitButtonModule,
    PaginatorModule,
    TranslatePipe,
    InputTextModule,
  ],
  templateUrl: './others-attendance-log-list.component.html',
  styleUrl: './others-attendance-log-list.component.scss',
  providers: [MessageService],
})
export default class OthersAttendanceLogListComponent
  extends BaseListComponent<
    AttendanceLog,
    AttendanceLogPopupComponent,
    AttendanceService,
    AttendanceLogFilter
  >
  implements OnInit
{
  @Input() isActive: boolean = false;
  @Input() creators: BaseLookupModel[] = [];
  @Input() employees: BaseLookupModel[] = [];
  @Input() departments: BaseLookupModel[] = [];

  languageService = inject(LanguageService);
  departmentService = inject(DepartmentService);
  userService = inject(UserService);
  attendanceService = inject(AttendanceService);

  actionList: MenuItem[] = [];
  channels: BaseLookupModel[] = [];

  filterModel: AttendanceLogFilter = new AttendanceLogFilter();
  processingStatusOptions: BooleanOptionModel[] = PROCESSING_STATUS_OPTIONS;

  confirmationService = inject(ConfirmationService);
  alertService = inject(AlertService);

  override dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };

  override get service() {
    return this.attendanceService;
  }

  get optionLabel(): string {
    const lang = this.languageService.getCurrentLanguage();
    return lang === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }

  isCurrentLanguageEnglish() {
    return this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH;
  }

  override initListComponent(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    // Watch for changes in isActive input
    if (changes['isActive'] && changes['isActive'].currentValue === true) {
      console.log('Others attendance tab became active - loading data');
      this.loadDataIfNeeded();
    }
  }

  private loadDataIfNeeded(): void {
    // Load data when tab becomes active
    this.loadListSP().subscribe({
      next: (response) => this.handleLoadListSuccess(response),
      error: this.handleLoadListError,
    });
  }

  protected override getBreadcrumbKeys() {
    return [{ labelKey: 'MENU.ATTENDANCE_LOGS' }];
  }

  override openDialog(attendanceLog?: AttendanceLog): void {
    const model = attendanceLog ?? new AttendanceLog();
    const viewMode = attendanceLog ? ViewModeEnum.EDIT : ViewModeEnum.CREATE;
    this.openBaseDialogSP(AttendanceLogPopupComponent as any, model, viewMode, {
      departments: this.departments,
      employees: this.employees,
    });
  }

  onDepartmentChange(deptId: number | undefined) {
    this.filterModel.departmentId = deptId ?? undefined;
  }

  onEmployeeChange(empId: number | undefined) {
    this.filterModel.employeeId = empId ?? undefined;
  }

  onCreatorChange(creatorId: number | undefined) {
    this.filterModel.creatorId = creatorId ?? undefined;
  }

  onChannelChange(channelName: string | undefined) {
    this.filterModel.channelName = channelName ?? undefined;
  }

  openConfirmation() {
    const dialogRef = this.confirmationService.open({
      icon: 'warning',
      messages: ['COMMON.CONFIRM_DELETE'],
      confirmText: 'COMMON.OK',
      cancelText: 'COMMON.CANCEL',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == DIALOG_ENUM.OK) {
        // User confirmed
        this.alertService.showSuccessMessage({ messages: ['COMMON.DELETED_SUCCESSFULLY'] });
      } else {
        // User canceled
        this.alertService.showErrorMessage({ messages: ['COMMON.DELETION_FAILED'] });
      }
    });
  }

  formatSwipeTimeArEn(swipeTime: string | Date | undefined): { date: string; time: string } {
    if (!swipeTime) return { date: '', time: '' };
    const locale = this.isCurrentLanguageEnglish() ? 'en-US' : 'ar-EG';
    const { date, time } = formatSwipeTime(swipeTime.toString(), locale);
    return { date, time };
  }

  swipeTimeArEn(swipeTime: string | Date | undefined): string {
    const { date, time } = this.formatSwipeTimeArEn(swipeTime);
    return `${date} ${time}`;
  }

  getProcessingStatusClass(isProcessed: boolean): string {
    return isProcessed ? 'bg-[#ecfdf3] text-[#085d3a]' : 'bg-[#fffaeb] text-[#93370d]';
  }

  getProcessingStatusDotClass(isProcessed: boolean): string {
    return isProcessed ? 'bg-[#085d3a]' : 'bg-[#93370d]';
  }

  exportPdf(fileName: string = 'data.pdf'): void {
    const allDataParams = {
      ...this.paginationParams,
      pageNumber: 1,
      pageSize: CustomValidators.defaultLengths.INT_MAX, // fetch all
    };

    const isRTL = this.langService.getCurrentLanguage() === LANGUAGE_ENUM.ARABIC;

    this.service.loadPaginatedSP(allDataParams, { ...this.filterModel! }).subscribe({
      next: (response) => {
        const allData = response?.list || [];

        if (!allData.length) return;

        // Transform data for PDF
        const transformedData = allData.map((model) => ({
          [this.translateService.instant('ATTENDANCE_LOG_PAGE.PROCESSING_STATUS')]:
            this.translateService.instant('ATTENDANCE_LOG_PAGE.PROCESSING'),
          [this.translateService.instant('ATTENDANCE_LOG_PAGE.CREATOR_EN')]:
            model.creatorNameEn ?? 'System',
          [this.translateService.instant('ATTENDANCE_LOG_PAGE.CREATOR_AR')]:
            model.creatorNameAr ?? 'النظام',
          [this.translateService.instant('ATTENDANCE_LOG_PAGE.CHANNEL_NAME')]: model.channelName,
          [this.translateService.instant('ATTENDANCE_LOG_PAGE.SWIPE_TIME')]: this.swipeTimeArEn(
            model.swipeTime
          ),
          [this.translateService.instant('ATTENDANCE_LOG_PAGE.EMPLOYEE_NAME_EN')]:
            model.employeeNameEn,
          [this.translateService.instant('ATTENDANCE_LOG_PAGE.EMPLOYEE_NAME_AR')]:
            model.employeeNameAr,
        }));

        const formatCell = (val: any): string | number => {
          if (val instanceof Date) {
            return val.toLocaleString();
          }
          return val != null ? val : '';
        };

        const head = [Object.keys(transformedData[0])];
        const body = transformedData.map((row) => Object.values(row).map(formatCell));

        const doc = new jsPDF({
          orientation: 'landscape',
          format: 'a4',
        });

        registerIBMPlexArabicFont(doc);

        autoTable(doc, {
          head,
          body,
          styles: {
            font: 'IBMPlexSansArabic',
            fontStyle: 'normal',
            halign: isRTL ? 'right' : 'left',
          },
          headStyles: {
            font: 'IBMPlexSansArabic',
            fontStyle: 'normal',
            halign: isRTL ? 'right' : 'left',
          },
          margin: isRTL ? { right: 10, left: 0 } : { left: 10, right: 0 },
          didDrawPage: () => {
            const title = isRTL ? 'سجل الحضور' : 'Attendance Log';
            doc.setFont('IBMPlexSansArabic');
            doc.setFontSize(12);
            doc.text(title, isRTL ? doc.internal.pageSize.getWidth() - 20 : 10, 10, {
              align: isRTL ? 'right' : 'left',
            });
          },
        });

        doc.save(fileName);
      },
      error: (err) => {
        console.error('Failed to fetch data for PDF export:', err);
        // Optional: show error toast
      },
    });
  }

  protected override mapModelToExcelRow(model: AttendanceLog): { [key: string]: any } {
    return {
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.EMPLOYEE_NAME_AR')]: model.employeeNameAr,
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.EMPLOYEE_NAME_EN')]: model.employeeNameEn,
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.SWIPE_TIME')]: this.swipeTimeArEn(
        model.swipeTime
      ),
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.CHANNEL_NAME')]: model.channelName,
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.CREATOR_EN')]:
        model.creatorNameEn ?? 'System',
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.CREATOR_AR')]:
        model.creatorNameAr ?? 'النظام',
      [this.translateService.instant('ATTENDANCE_LOG_PAGE.PROCESSING_STATUS')]:
        this.translateService.instant('ATTENDANCE_LOG_PAGE.PROCESSING'),
    };
  }
}
