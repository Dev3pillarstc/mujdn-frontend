import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { AllVisitRequestListComponent } from '../all-visit-request-list/all-visit-request-list.component';
import { MyCreatedVisitRequestListComponent } from '../my-created-visit-request-list/my-created-visit-request-list.component';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

enum TabIndex {
  MY_VISITS = 0,
  ALL_VISITS = 1,
}

@Component({
  selector: 'app-visit-request-container',
  imports: [
    Breadcrumb,
    TabsModule,
    AllVisitRequestListComponent,
    MyCreatedVisitRequestListComponent,
    TranslatePipe,
  ],
  templateUrl: './visit-request-container.component.html',
  styleUrl: './visit-request-container.component.scss',
})
export default class VisitRequestContainerComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  home: MenuItem | undefined;

  private readonly translateService = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();

  activeTabIndex = TabIndex.MY_VISITS;

  // Tab initialization tracking
  private readonly tabsInitialized = new Set<TabIndex>();

  ngOnInit(): void {
    this.initializeComponent();
    this.setupLanguageChangeListener();
    this.markTabAsInitialized(TabIndex.MY_VISITS); // Mark first tab as initialized
  }

  clickMyVisitsTab(): void {
    this.switchToTab(TabIndex.MY_VISITS);
  }

  clickAllVisitsTab(): void {
    this.switchToTab(TabIndex.ALL_VISITS);
  }

  private initializeComponent(): void {
    this.setHomeItem();
    this.initBreadcrumbs();
  }

  private setupLanguageChangeListener(): void {
    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setHomeItem();
      this.initBreadcrumbs();
    });
  }

  private switchToTab(tabIndex: TabIndex): void {
    this.activeTabIndex = tabIndex;

    if (this.shouldLoadTabData(tabIndex)) {
      this.markTabAsInitialized(tabIndex);
    }
  }

  private shouldLoadTabData(tabIndex: TabIndex): boolean {
    // Always reload my visits tab data when switching back
    if (tabIndex === TabIndex.MY_VISITS) {
      return true;
    }

    // Only load all visits tab data if not already initialized
    return !this.tabsInitialized.has(tabIndex);
  }

  private markTabAsInitialized(tabIndex: TabIndex): void {
    this.tabsInitialized.add(tabIndex);
  }

  private setHomeItem(): void {
    this.home = {
      label: this.translateService.instant('COMMON.HOME'),
      icon: 'pi pi-home',
      routerLink: '/home',
    };
  }

  private initBreadcrumbs(): void {
    this.items = this.getBreadcrumbKeys().map((item) => ({
      label: this.translateService.instant(item.labelKey),
      icon: item.icon,
      routerLink: item.routerLink,
    }));
  }

  private getBreadcrumbKeys(): Array<{
    labelKey: string;
    icon?: string;
    routerLink?: string;
  }> {
    return [{ labelKey: 'MENU.VISIT_REQUESTS' }];
  }

  // Helper methods for template
  isMyVisitsTabActive(): boolean {
    return this.activeTabIndex === TabIndex.MY_VISITS;
  }

  isAllVisitsTabActive(): boolean {
    return this.activeTabIndex === TabIndex.ALL_VISITS;
  }

  isAllVisitsTabInitialized(): boolean {
    return this.tabsInitialized.has(TabIndex.ALL_VISITS);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
