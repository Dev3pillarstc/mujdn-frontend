import { ROLES_ENUM } from '@/enums/roles-enum';
import { AuthService } from '@/services/auth/auth.service';
import MyShiftsComponent from '@/views/features/lookups/work-shifts/my-shifts/my-shifts.component';
import WorkShiftsAssignmentComponent from '@/views/features/lookups/work-shifts/work-shifts-assignment/work-shifts-assignment.component';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TabsModule } from 'primeng/tabs';
import { Subject, takeUntil } from 'rxjs';

enum TabIndex {
  MY_SHIFTS = 0,
  ASSIGNMENTS = 1,
}

@Component({
  selector: 'app-work-shifts-assignment-container',
  imports: [
    Breadcrumb,
    MyShiftsComponent,
    RouterModule,
    TabsModule,
    TranslatePipe,
    WorkShiftsAssignmentComponent,
  ],
  templateUrl: './work-shifts-assignment-container.component.html',
  styleUrl: './work-shifts-assignment-container.component.scss',
})
export default class WorkShiftsAssignmentContainerComponent implements OnInit, OnDestroy {
  @ViewChild(MyShiftsComponent) myShiftsComponent?: MyShiftsComponent;

  @ViewChild(WorkShiftsAssignmentComponent)
  workShiftsAssignmentComponent?: WorkShiftsAssignmentComponent;

  breadcrumbs: MenuItem[] = [];
  activeTabIndex = TabIndex.MY_SHIFTS;

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

  showAssignmentsTab(): boolean {
    const roles = this.authService.getUser().value?.roles ?? [];
    return roles.includes(ROLES_ENUM.HR_OFFICER) || roles.includes(ROLES_ENUM.DEPARTMENT_MANAGER);
  }

  onTabChange(index: number | string): void {
    this.activeTabIndex = Number(index);

    if (this.activeTabIndex === TabIndex.ASSIGNMENTS) {
      setTimeout(() => this.workShiftsAssignmentComponent?.loadEmbeddedData());
    }
  }

  clickMyShiftsTab(): void {
    this.activeTabIndex = TabIndex.MY_SHIFTS;
    setTimeout(() => this.myShiftsComponent?.reloadEmbeddedData());
  }

  private setHomeItem(): void {
    this.home = {
      label: this.translateService.instant('COMMON.HOME'),
      icon: 'pi pi-home',
      routerLink: '/home',
    };
  }

  private initBreadcrumbs(): void {
    this.breadcrumbs = [
      { label: this.translateService.instant('USER_WORK_SHIFT_PAGE.WORK_SHIFT_ASSIGNMENT') },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
