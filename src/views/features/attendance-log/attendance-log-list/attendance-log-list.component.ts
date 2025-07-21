import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
import OthersAttendanceLogListComponent from '../others-attendance-log-list/others-attendance-log-list.component';
import MyAttendanceLogListComponent from '../my-attendance-log-list/my-attendance-log-list.component';
import { Tab, TabsModule } from 'primeng/tabs';
import { AuthService } from '@/services/auth/auth.service';

@Component({
  selector: 'app-attendance-log-list',
  imports: [
    Breadcrumb,
    RouterModule,
    TranslatePipe,
    OthersAttendanceLogListComponent,
    MyAttendanceLogListComponent,
    TabsModule,
  ],
  templateUrl: './attendance-log-list.component.html',
  styleUrl: './attendance-log-list.component.scss',
  providers: [MessageService],
})
export default class AttendanceLogListComponent {
  breadcrumbs: MenuItem[] = [];
  translateService = inject(TranslateService);
  authService = inject(AuthService);
  home = {
    label: this.translateService.instant('COMMON.HOME'),
    icon: 'pi pi-home',
    routerLink: '/home',
  };
  private langChangeSub!: Subscription;
  ngOnInit() {
    this.setHomeItem();
    this.initBreadcrumbs();

    // Listen to language changes
    this.langChangeSub = this.translateService.onLangChange.subscribe(() => {
      this.setHomeItem();
      this.initBreadcrumbs();
    });
  }
  setHomeItem(): void {
    this.home = {
      label: this.translateService.instant('COMMON.HOME'),
      icon: 'pi pi-home',
      routerLink: '/home',
    };
  }
  private initBreadcrumbs(): void {
    this.breadcrumbs = this.getBreadcrumbKeys().map((item) => ({
      label: this.translateService.instant(item.labelKey),
      icon: item.icon,
      routerLink: item.routerLink,
    }));
  }

  protected getBreadcrumbKeys(): {
    labelKey: string;
    icon?: string;
    routerLink?: string;
  }[] {
    return [{ labelKey: 'MENU.ATTENDANCE_LOGS' }];
  }
  clickMyAttendanceLogTab() {
    console.log('clickMyAttendanceLogTab');
  }
  clickOthersAttendanceLogTab() {
    console.log('clickOthersAttendanceLogTab');
  }
  showOthersAttendanceLogs() {
    return (
      this.authService.isSecurityLeader ||
      this.authService.isDepartmentManager ||
      this.authService.isHROfficer ||
      this.authService.isAdmin
    );
  }
}
