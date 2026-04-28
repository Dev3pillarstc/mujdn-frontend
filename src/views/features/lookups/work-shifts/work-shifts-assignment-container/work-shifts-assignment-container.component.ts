import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';
import { AuthService } from '@/services/auth/auth.service';
import { DepartmentService } from '@/services/features/lookups/department.service';
import { UserService } from '@/services/features/user.service';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { AttendanceService } from '@/services/features/attendance-log.service';
import WorkShiftsAssignmentComponent from '../work-shifts-assignment/work-shifts-assignment.component';
import { ChangableWorkShiftsAssignmentComponent } from '../changable-work-shifts-assignment/changable-work-shifts-assignment.component';

@Component({
  selector: 'app-work-shifts-assignment-container',
  imports: [
    Breadcrumb,
    RouterModule,
    TabsModule,
    ChangableWorkShiftsAssignmentComponent,
    WorkShiftsAssignmentComponent
  ],
  templateUrl: './work-shifts-assignment-container.component.html',
  styleUrl: './work-shifts-assignment-container.component.scss',

  providers: [MessageService],
})
export default class WorkShiftsAssignmentContainerComponent {
  breadcrumbs: MenuItem[] = [];

  // Track active tab
  activeTabIndex: number = 0;

  departments: BaseLookupModel[] = [];
  employees: UsersWithDepartmentLookup[] = [];
  creators: BaseLookupModel[] = [];

  home = {
    label: 'لوحة المعلومات',
    icon: 'pi pi-home',
    routerLink: '/home',
  };

  ngOnInit() {
  }
}
