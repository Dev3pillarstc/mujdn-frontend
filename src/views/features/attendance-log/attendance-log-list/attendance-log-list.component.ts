import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import OthersAttendanceLogListComponent from '../others-attendance-log-list/others-attendance-log-list.component';
import MyAttendanceLogListComponent from '../my-attendance-log-list/my-attendance-log-list.component';
import { TabsModule } from 'primeng/tabs';
import { AuthService } from '@/services/auth/auth.service';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { UserService } from '@/services/features/user.service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';

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
export default class AttendanceLogListComponent implements OnInit, OnDestroy {
  breadcrumbs: MenuItem[] = [];
  translateService = inject(TranslateService);
  authService = inject(AuthService);
  departmentService = inject(DepartmentService);
  userService = inject(UserService);
  destroy$: Subject<void> = new Subject<void>();

  // Track active tab
  activeTabIndex: number = 0;

  departments: BaseLookupModel[] = [];
  employees: BaseLookupModel[] = [];
  creators: BaseLookupModel[] = [];

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
    this.loadLookups();
  }

  loadLookups(): void {
    // Load lookups
    this.departmentService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.departments = res;
    });

    this.userService.getUsersWithDepartment().subscribe((res: UsersWithDepartmentLookup[]) => {
      this.employees = res;
      this.creators = res; // Same users can be creators
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
    console.log('Tab changed to index:', this.activeTabIndex);

    // The child components will automatically detect the change in isActive
    // and trigger their data loading
  }

  clickMyAttendanceLogTab() {
    console.log('clickMyAttendanceLogTab');
    this.activeTabIndex = 0;
  }

  clickOthersAttendanceLogTab() {
    console.log('clickOthersAttendanceLogTab');
    this.activeTabIndex = 1;
  }

  showOthersAttendanceLogs() {
    return (
      this.authService.isDepartmentManager ||
      this.authService.isHROfficer ||
      this.authService.isAdmin
    );
  }

  // Helper methods to determine if each tab is active
  isMyAttendanceTabActive(): boolean {
    return this.activeTabIndex === 0;
  }

  isOthersAttendanceTabActive(): boolean {
    return this.activeTabIndex === 1;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
