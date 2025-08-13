// blacklisted-container.component.ts
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { BlacklistedNationalityListComponent } from '../black-list-nationalities/blacklisted-nationalities-list.component';
import { BlacklistedNationalIdListComponent } from '../black-list-national-ids/blacklisted-national-ids-list.component';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { NationalityService } from '@/services/features/lookups/nationality.service';
import { BlacklistedNationalityService } from '@/services/features/visit/blacklisted-nationality.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { BlacklistedNationality } from '@/models/features/visit/blacklisted-nationality';

enum TabIndex {
  NATIONALITIES = 0,
  NATIONAL_IDS = 1,
}

@Component({
  selector: 'app-blacklisted-container',
  imports: [
    Breadcrumb,
    TabsModule,
    BlacklistedNationalityListComponent,
    BlacklistedNationalIdListComponent,
    TranslatePipe,
  ],
  templateUrl: './blacklisted-container.component.html',
  styleUrl: './blacklisted-container.component.scss',
})
export default class BlacklistedContainerComponent implements OnInit, OnDestroy {
  breadcrumbs: MenuItem[] = [];
  home: MenuItem | undefined;

  private readonly translateService = inject(TranslateService);
  private readonly nationalityService = inject(NationalityService);
  private readonly blacklistedNationalityService = inject(BlacklistedNationalityService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();

  activeTabIndex = TabIndex.NATIONALITIES;
  nationalities: BaseLookupModel[] = [];

  // Tab initialization tracking
  private readonly tabsInitialized = new Set<TabIndex>();
  nationalityTabData: PaginatedList<BlacklistedNationality> | null = null;

  ngOnInit(): void {
    this.initializeComponent();
    this.loadInitialData();
    this.setupLanguageChangeListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clickNationalitiesTab(): void {
    this.switchToTab(TabIndex.NATIONALITIES);
  }

  clickNationalIdsTab(): void {
    this.switchToTab(TabIndex.NATIONAL_IDS);
  }

  private initializeComponent(): void {
    this.setHomeItem();
    this.initBreadcrumbs();
  }

  private loadInitialData(): void {
    this.loadNationalities();
    this.loadNationalityTabDataFromResolver();
    this.markTabAsInitialized(TabIndex.NATIONALITIES);
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
      this.loadTabData(tabIndex);
    }
  }

  private shouldLoadTabData(tabIndex: TabIndex): boolean {
    // Always reload nationality tab data when switching back
    if (tabIndex === TabIndex.NATIONALITIES) {
      return true;
    }

    // Only load national ID tab data if not already initialized
    return !this.tabsInitialized.has(tabIndex);
  }

  private loadTabData(tabIndex: TabIndex): void {
    switch (tabIndex) {
      case TabIndex.NATIONALITIES:
        this.loadNationalityTabData();
        break;
      case TabIndex.NATIONAL_IDS:
        // National ID tab will handle its own data loading
        this.markTabAsInitialized(tabIndex);
        break;
    }
  }

  private loadNationalityTabDataFromResolver(): void {
    const resolverData = this.activatedRoute.snapshot.data['list'];
    if (resolverData) {
      this.nationalityTabData = resolverData;
    }
  }

  private loadNationalityTabData(): void {
    const paginationParams = new PaginationParams();

    this.blacklistedNationalityService
      .loadPaginated(paginationParams, {})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.nationalityTabData = data;
        },
        error: (error) => {
          console.error('Error loading nationality tab data:', error);
          this.nationalityTabData = null;
        },
      });
  }

  private loadNationalities(): void {
    this.nationalityService
      .getLookup()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (nationalities) => {
          this.nationalities = nationalities;
        },
        error: (error) => {
          console.error('Error loading nationalities:', error);
        },
      });
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
    this.breadcrumbs = this.getBreadcrumbKeys().map((item) => ({
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
    return [{ labelKey: 'MENU.BLACKLIST' }];
  }

  // Helper methods for template
  isNationalitiesTabActive(): boolean {
    return this.activeTabIndex === TabIndex.NATIONALITIES;
  }

  isNationalIdsTabActive(): boolean {
    return this.activeTabIndex === TabIndex.NATIONAL_IDS;
  }

  isNationalIdTabInitialized(): boolean {
    return this.tabsInitialized.has(TabIndex.NATIONAL_IDS);
  }
}
