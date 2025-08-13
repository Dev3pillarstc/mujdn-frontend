import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MatDialog } from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { PresenceInquiriesPopupComponent } from '../presence-inquiries-popup/presence-inquiries-popup.component';
import { AssignEmployeeResponsibilityPopupComponent } from '../assign-employee-responsibility-popup/assign-employee-responsibility-popup.component';
import { ViewEmployeesCheckPopupComponent } from '../view-employees-check-popup/view-employees-check-popup.component';
import { MyPresenceInquiriesListComponent } from '../my-presence-inquiries-list/my-presence-inquiries-list.component';
import { OthersPresenceInquiriesListComponent } from '../others-presence-inquiries-list/others-presence-inquiries-list.component';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { AuthService } from '@/services/auth/auth.service';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { UserService } from '@/services/features/user.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-presence-inquiries-list',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    Select,
    DatePickerModule,
    FormsModule,
    TabsModule,
    MyPresenceInquiriesListComponent,
    OthersPresenceInquiriesListComponent,
    TranslatePipe,
  ],
  templateUrl: './presence-inquiries-list.component.html',
  styleUrl: './presence-inquiries-list.component.scss',
})
export default class PresenceInquiriesListComponent implements OnInit, OnDestroy {
  breadcrumbs: MenuItem[] = [];
  translateService = inject(TranslateService);
  destroy$: Subject<void> = new Subject<void>();
  authService = inject(AuthService);

  // Track active tab
  activeTabIndex: number = 0;

  home = {
    label: this.translateService.instant('COMMON.HOME'),
    icon: 'pi pi-home',
    routerLink: '/home',
  };

  ngOnInit() {
    this.setHomeItem();
    this.initBreadcrumbs();

    // Listen to language changes
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
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

  onTabChange(event: any) {
    this.activeTabIndex = event.index;
    // The child components will automatically detect the change in isActive
    // and trigger their data loading
  }
  showOthersInquiries() {
    return this.authService.isFollowUpOfficer;
  }

  clickMyTab() {
    this.activeTabIndex = 0;
  }

  clickOthersTab() {
    this.activeTabIndex = 1;
  }

  // Helper methods to determine if each tab is active
  isMyTabActive(): boolean {
    return this.activeTabIndex === 0;
  }

  isOthersTabActive(): boolean {
    return this.activeTabIndex === 1;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
