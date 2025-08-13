import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { BlacklistedNationalityListComponent } from '../black-list-nationalities/blacklisted-nationalities-list.component';
import { BlacklistedNationalIdListComponent } from '../black-list-national-ids/blacklisted-national-ids-list.component';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { NationalityService } from '@/services/features/lookups/nationality.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

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
  translateService = inject(TranslateService);
  nationalityService = inject(NationalityService);
  destroy$: Subject<void> = new Subject<void>();

  // Track active tab
  activeTabIndex: number = 0;

  nationalities: BaseLookupModel[] = [];

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
    this.nationalityService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.nationalities = res;
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
    return [{ labelKey: 'MENU.BLACKLIST' }];
  }

  clickNationalitiesTab() {
    console.log('clickNationalitiesTab');
    this.activeTabIndex = 0;
  }

  clickNationalIdsTab() {
    console.log('clickNationalIdsTab');
    this.activeTabIndex = 1;
  }

  // Helper methods to determine if each tab is active
  isNationalitiesTabActive(): boolean {
    return this.activeTabIndex === 0;
  }

  isNationalIdsTabActive(): boolean {
    return this.activeTabIndex === 1;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
