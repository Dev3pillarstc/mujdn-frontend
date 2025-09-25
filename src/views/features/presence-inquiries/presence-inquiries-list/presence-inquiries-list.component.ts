import { Component, inject, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PresenceInquiry } from '@/models/features/presence-inquiry/presence-inquiry';

@Component({
  selector: 'app-presence-inquiries-list',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
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
  destroy$ = new Subject<void>();
  authService = inject(AuthService);

  @ViewChild('myList') myList!: MyPresenceInquiriesListComponent;
  @ViewChild('othersList') othersList!: OthersPresenceInquiriesListComponent;

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
      routerLink: item.routerLink,
    }));
  }

  protected getBreadcrumbKeys(): { labelKey: string; icon?: string; routerLink?: string }[] {
    return [{ labelKey: 'INQUIRIES_PAGE.PRESENCE_INQUIRIES' }];
  }

  showOthersInquiries(): boolean {
    return this.authService.isFollowUpOfficer!;
  }

  onTabChange(index: number | string) {
    const selectedIndex = Number(index);

    if (selectedIndex === 0 && this.myList) {
      this.myList.loadList().subscribe({
        next: (response) => this.myList.handleLoadListSuccess(response),
      });
    } else if (selectedIndex === 1 && this.othersList) {
      this.othersList.loadList().subscribe({
        next: (response) => this.othersList.handleLoadListSuccess(response),
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
