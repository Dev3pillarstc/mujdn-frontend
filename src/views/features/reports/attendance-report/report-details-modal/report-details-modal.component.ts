import { BaseAppComponent } from '@/views/app/base-app/base-app.component';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DatePipe } from '@angular/common';
import AttendanceReport from '@/models/features/attendance/attendance-report/attendance-report';
import { LanguageService } from '@/services/shared/language.service';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { ATTENDANCE_STATUS_CONFIG, ATTENDANCE_STATUS_ENUM } from '@/enums/attendance-status-enum';
import { formatDateTo12Hour } from '@/utils/general-helper';
import { DIALOG_ENUM } from '@/enums/dialog-enum';

export interface ReportDetailsDialogData {
  model: AttendanceReport;
  showEmployeeDetails: boolean;
}

@Component({
  selector: 'app-report-details-modal',
  imports: [TranslateModule, CommonModule],
  providers: [DatePipe],
  templateUrl: './report-details-modal.component.html',
  styleUrl: './report-details-modal.component.scss',
})
export class ReportDetailsModalComponent extends BaseAppComponent implements OnInit {
  readonly emptyValue = '-';

  model!: AttendanceReport;
  showEmployeeDetails: boolean = false;

  private langSvc = inject(LanguageService);
  private datePipe = inject(DatePipe);
  private dialogRef = inject(MatDialogRef<ReportDetailsModalComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: ReportDetailsDialogData) {
    super();
    this.model = data?.model;
    this.showEmployeeDetails = data?.showEmployeeDetails ?? false;
  }

  // ─── Computed getters ──────────────────────────────────────────────────────

  get employeeName(): string {
    return this.displayValue(
      this.langSvc.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH
        ? this.model.fullNameEn
        : this.model.fullNameAr
    );
  }

  get departmentName(): string {
    return this.displayValue(
      this.langSvc.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH
        ? this.model.departmentNameEn
        : this.model.departmentNameAr
    );
  }

  get shiftName(): string {
    return this.displayValue(this.model.getShiftName());
  }

  get holidayName(): string {
    return this.displayValue(this.model.getHolidayName());
  }

  get missionName(): string {
    return this.displayValue(this.model.getMissionName());
  }

  get missionTypeTranslationKey(): string | null {
    return this.model.getMissionTypeTranslationKey() || null;
  }

  get hasPermission(): boolean {
    return !!(this.model.attendancePermissionId || this.model.leavePermissionId);
  }

  // ─── Formatting helpers ────────────────────────────────────────────────────

  formatDate(date: string | Date | null | undefined): string {
    if (!date) return '-';
    return this.datePipe.transform(new Date(date), 'dd-MM-yyyy') ?? '-';
  }

  formatTime(date: Date | null | undefined): string {
    if (!date) return '-';
    const locale = this.langSvc.getCurrentLanguage() === LANGUAGE_ENUM.ENGLISH ? 'en-US' : 'ar-EG';
    return formatDateTo12Hour(date, locale);
  }

  displayValue(value: string | number | null | undefined): string {
    return value === null || value === undefined || value === '' ? this.emptyValue : `${value}`;
  }

  getStatusConfig(status: number) {
    return (
      ATTENDANCE_STATUS_CONFIG[status as ATTENDANCE_STATUS_ENUM] ??
      ATTENDANCE_STATUS_CONFIG[ATTENDANCE_STATUS_ENUM.ABSENT]
    );
  }

  getPermissionLabel(): string {
    if (this.model.attendancePermissionId && this.model.leavePermissionId) {
      return 'ATTENDANCE_REPORT_PAGE.PRESENCE_LEAVE';
    }
    if (this.model.leavePermissionId && !this.model.attendancePermissionId) {
      return 'ATTENDANCE_REPORT_PAGE.LEAVE';
    }
    if (this.model.attendancePermissionId && !this.model.leavePermissionId) {
      return 'ATTENDANCE_REPORT_PAGE.PRESENCE';
    }
    return '';
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  close(): void {
    this.dialogRef.close(DIALOG_ENUM.CANCEL);
  }
}
