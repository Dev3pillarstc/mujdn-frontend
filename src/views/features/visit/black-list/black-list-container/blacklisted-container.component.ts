import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { BlacklistedNationalityListComponent } from '../black-list-nationalities/blacklisted-nationalities-list.component';
import { BlacklistedNationalIdListComponent } from '../black-list-national-ids/blacklisted-national-ids-list.component';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { NationalityService } from '@/services/features/lookups/nationality.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';

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
export default class BlacklistedContainerComponent {
  breadcrumbs: MenuItem[] = [];
  home: MenuItem | undefined;
  nationalityService = inject(NationalityService);
  translateService = inject(TranslateService);
  destroy$: Subject<void> = new Subject<void>();
  nationalities: BaseLookupModel[] = [];

  loadLookups(): void {
    this.nationalityService.getLookup().subscribe((res: BaseLookupModel[]) => {
      this.nationalities = res;
    });
  }

  ngOnInit() {
    this.setHomeItem();
    this.initBreadcrumbs();

    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setHomeItem();
      this.initBreadcrumbs();
    });
    this.loadLookups();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
