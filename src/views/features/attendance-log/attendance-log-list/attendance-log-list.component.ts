import { Component, inject, OnInit } from '@angular/core';
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
import { AttendanceService } from '@/services/features/attendance.service';
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

// Define constants for options
const PROCESSING_STATUS_OPTIONS: BaseLookupModel[] = [
  { id: 1, nameAr: 'تمت المعالجة', nameEn: 'Processed' },
  { id: 2, nameAr: 'قيد المعالجة', nameEn: 'Processing' },
];

const MOVEMENT_TYPE_OPTIONS: BaseLookupModel[] = [
  { id: 1, nameAr: 'حضور', nameEn: 'Check In' },
  { id: 2, nameAr: 'انصراف', nameEn: 'Check Out' },
  { id: 3, nameAr: 'استراحة', nameEn: 'Break' },
];

const WORK_TYPE_OPTIONS: BaseLookupModel[] = [
  { id: 1, nameAr: 'دوام كلي', nameEn: 'Full Time' },
  { id: 2, nameAr: 'دوام جزئي', nameEn: 'Part Time' },
  { id: 3, nameAr: 'دوام نوبات', nameEn: 'Shift Work' },
];

@Component({
  selector: 'app-attendance-log-list',
  imports: [
    Breadcrumb,
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
  templateUrl: './attendance-log-list.component.html',
  styleUrl: './attendance-log-list.component.scss',
  providers: [MessageService],
})
export default class AttendanceLogListComponent
  extends BaseListComponent<
    AttendanceLog,
    AttendanceLogPopupComponent,
    AttendanceService,
    AttendanceLogFilter
  >
  implements OnInit
{
  languageService = inject(LanguageService);
  translateService = inject(TranslateService);
  departmentService = inject(DepartmentService);
  userService = inject(UserService);
  attendanceService = inject(AttendanceService);

  actionList: MenuItem[] = [];
  departments: BaseLookupModel[] = [];
  employees: BaseLookupModel[] = [];
  channels: BaseLookupModel[] = [];
  creators: BaseLookupModel[] = [];

  home: MenuItem | undefined;
  filterModel: AttendanceLogFilter = new AttendanceLogFilter();
  processingStatusOptions: BaseLookupModel[] = PROCESSING_STATUS_OPTIONS;
  movementTypeOptions: BaseLookupModel[] = MOVEMENT_TYPE_OPTIONS;
  workTypeOptions: BaseLookupModel[] = WORK_TYPE_OPTIONS;

  confirmationService = inject(ConfirmationService);
  alertService = inject(AlertService);

  override dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };

  override get service() {
    return this.attendanceService;
  }

  override initListComponent(): void {
    // Load lookups
    this.departmentService.getDepartmentsLookup().subscribe((res: BaseLookupModel[]) => {
      this.departments = res;
    });

    this.userService.getUsersWithDepartment().subscribe((res: UsersWithDepartmentLookup[]) => {
      console.log('Employees', res);
      this.employees = res;
      this.creators = res; // Same users can be creators
    });

    // Initialize breadcrumb
    // this.home = { icon: 'pi pi-home', routerLink: '/' };
  }

  override openDialog(attendanceLog?: AttendanceLog): void {
    const model = attendanceLog ?? new AttendanceLog();
    console.log('model i nlist', model);
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

  get optionLabel(): string {
    const lang = this.languageService.getCurrentLanguage();
    return lang === LANGUAGE_ENUM.ARABIC ? 'nameAr' : 'nameEn';
  }

  formatSwipeTime(swipeTime: string | undefined): { date: string; time: string } {
    if (!swipeTime) return { date: '', time: '' };

    const dateTime = new Date(swipeTime);
    const date = dateTime.toLocaleDateString('EG');
    const time = dateTime.toLocaleTimeString('EG');

    return { date, time };
  }

  getProcessingStatusClass(isProcessed: boolean): string {
    return isProcessed ? 'bg-[#ecfdf3] text-[#085d3a]' : 'bg-[#fffaeb] text-[#93370d]';
  }

  getProcessingStatusDotClass(isProcessed: boolean): string {
    return isProcessed ? 'bg-[#085d3a]' : 'bg-[#93370d]';
  }

  protected override mapModelToExcelRow(model: AttendanceLog): { [key: string]: any } {
    return {
      'ATTENDANCE_LOG_PAGE.EMPLOYEE_ID': model.identificationNumber,
      'ATTENDANCE_LOG_PAGE.EMPLOYEE_NAME_AR': model.employeeNameAr,
      'ATTENDANCE_LOG_PAGE.EMPLOYEE_NAME_EN': model.employeeNameEn,
      'ATTENDANCE_LOG_PAGE.DEPARTMENT': model.departmentNameAr,
      'ATTENDANCE_LOG_PAGE.SWIPE_TIME': model.swipeTime,
      'ATTENDANCE_LOG_PAGE.CHANNEL_NAME': model.channelName,
      'ATTENDANCE_LOG_PAGE.CREATOR': model.creatorNameAr,
    };
  }
}
