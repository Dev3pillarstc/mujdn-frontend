import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { MyPresenceInquiriesListComponent } from '../my-presence-inquiries-list/my-presence-inquiries-list.component';
import { OthersPresenceInquiriesListComponent } from '../others-presence-inquiries-list/others-presence-inquiries-list.component';
import { AuthService } from '@/services/auth/auth.service';
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
    return [{ labelKey: 'INQUIRIES_PAGE.PRESENCE_INQUIRIES' }];
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
