import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TabsModule } from 'primeng/tabs';
import { MyAttendanceReportListComponent } from '../my-attendance-report-list/my-attendance-report-list.component';
import { AllAttendanceReportListComponent } from '../all-attendance-report-list/all-attendance-report-list.component';
import { MenuItem } from '@/models/shared/menu-item';
import { AuthService } from '@/services/auth/auth.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import AttendanceReport from '@/models/features/attendance/attendance-report/attendance-report';
import { AttendanceReportFilter } from '@/models/features/attendance/attendance-report/attendance-report-filter';

@Component({
  selector: 'app-attendance-report-container',
  imports: [
    Breadcrumb,
    RouterModule,
    TabsModule,
    MyAttendanceReportListComponent,
    AllAttendanceReportListComponent,
    TranslatePipe,
  ],
  templateUrl: './attendance-report-container.component.html',
  styleUrl: './attendance-report-container.component.scss',
})
export default class AttendanceReportContainerComponent implements OnInit, OnDestroy {
  breadcrumbs: MenuItem[] = [];
  translateService = inject(TranslateService);
  destroy$ = new Subject<void>();
  authService = inject(AuthService);

  @ViewChild('myReports') myReports!: MyAttendanceReportListComponent;
  @ViewChild('allReports') allReports!: AllAttendanceReportListComponent;

  activeTabIndex = 0;

  home = {
    label: this.translateService.instant('COMMON.HOME'),
    icon: 'pi pi-home',
    routerLink: '/home',
  };

  ngOnInit() {
    this.setHomeItem();
    this.initBreadcrumbs();

    // Update breadcrumbs on language change
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setHomeItem();
      this.initBreadcrumbs();
    });
  }

  private setHomeItem(): void {
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
      routerLink: item.routerLink ? [item.routerLink] : undefined,
    }));
  }

  protected getBreadcrumbKeys(): { labelKey: string; icon?: string; routerLink?: string }[] {
    return [{ labelKey: 'ATTENDANCE_REPORT_PAGE.TITLE' }];
  }

  showAllReports(): boolean {
    // Example: only managers / officers can view subordinates’ reports
    return this.authService.isFollowUpOfficer!;
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     if (this.myReports) {
  //       this.myReports.loadList().subscribe();
  //     }
  //   });
  // }

  onTabChange(index: number | string) {
    const selectedIndex = Number(index);

    if (selectedIndex === 0 && this.myReports) {
      this.myReports.filterModel = {} as AttendanceReportFilter;
      this.myReports.appliedFilterModel = {} as AttendanceReportFilter;
      this.myReports.loadList().subscribe({
        next: (response) => this.myReports.handleLoadListSuccess(response),
      });
    } else if (selectedIndex === 1 && this.allReports) {
      this.allReports.filterModel = {} as AttendanceReportFilter;
      this.allReports.appliedFilterModel = {} as AttendanceReportFilter;
      this.allReports.loadList().subscribe({
        next: (response) => this.allReports.handleLoadListSuccess(response),
      });
    }
  }
  showOthersReportsTab(): boolean {
    return (
      this.authService.isDepartmentManager! ||
      this.authService.isHROfficer! ||
      this.authService.isAdmin!
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
