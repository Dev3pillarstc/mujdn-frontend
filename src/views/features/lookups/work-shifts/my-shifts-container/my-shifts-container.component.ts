import { MyShiftsViewComponent } from '@/views/features/lookups/work-shifts/my-shifts-view/my-shifts-view.component';
import { ShiftsViewComponent } from '@/views/features/lookups/work-shifts/shifts-view/shifts-view.component';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TabsModule } from 'primeng/tabs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { ROLES_ENUM } from '@/enums/roles-enum';
import { AuthService } from '@/services/auth/auth.service';

enum TabIndex {
  MY_SHIFT_DAYS = 0,
  EMPLOYEE_SHIFT_DAYS = 1,
}

@Component({
  selector: 'app-my-shifts-container',
  imports: [
    Breadcrumb,
    MyShiftsViewComponent,
    RouterModule,
    ShiftsViewComponent,
    TabsModule,
    TranslatePipe,
  ],
  templateUrl: './my-shifts-container.component.html',
  styleUrl: './my-shifts-container.component.scss',
})
export default class MyShiftsContainerComponent implements OnInit, OnDestroy {
  @ViewChild(MyShiftsViewComponent) myShiftsViewComponent?: MyShiftsViewComponent;

  @ViewChild(ShiftsViewComponent) shiftsViewComponent?: ShiftsViewComponent;

  breadcrumbs: MenuItem[] = [];
  activeTabIndex = TabIndex.MY_SHIFT_DAYS;

  private readonly authService = inject(AuthService);
  private readonly translateService = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();

  home: MenuItem = {
    label: this.translateService.instant('COMMON.HOME'),
    icon: 'pi pi-home',
    routerLink: '/home',
  };

  ngOnInit(): void {
    this.setHomeItem();
    this.initBreadcrumbs();

    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setHomeItem();
      this.initBreadcrumbs();
    });
  }

  onTabChange(index: number | string): void {
    this.activeTabIndex = Number(index);

    if (this.activeTabIndex === TabIndex.EMPLOYEE_SHIFT_DAYS) {
      setTimeout(() => this.shiftsViewComponent?.loadEmbeddedData());
    }
  }

  clickMyShiftDaysTab(): void {
    this.activeTabIndex = TabIndex.MY_SHIFT_DAYS;
    setTimeout(() => {
      this.myShiftsViewComponent?.loadList().subscribe({
        next: (response) => this.myShiftsViewComponent?.handleLoadListSuccess(response),
        error: () => this.myShiftsViewComponent?.handleLoadListError(),
      });
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
    this.breadcrumbs = [{ label: this.translateService.instant('MENU.EMPLOYEE_SHIFTS') }];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showAssignmentsTab(): boolean {
    const roles = this.authService.getUser().value?.roles ?? [];
    return roles.includes(ROLES_ENUM.HR_OFFICER) || roles.includes(ROLES_ENUM.DEPARTMENT_MANAGER);
  }
}
