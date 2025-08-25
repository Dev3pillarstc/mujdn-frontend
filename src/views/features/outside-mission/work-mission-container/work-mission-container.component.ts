import { Component, inject, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { TabsModule } from 'primeng/tabs';
import { MyWorkMissionListComponent } from '@/views/features/outside-mission/my-work-mission-list/my-work-mission-list.component';
import { AssignWorkMissionListComponent } from '@/views/features/outside-mission/assign-work-mission-list/assign-work-mission-list.component';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { WorkMission } from '@/models/features/business/work-mission';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { AuthService } from '@/services/auth/auth.service';

@Component({
  selector: 'app-work-mission-container',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    PaginatorModule,
    DatePickerModule,
    TabsModule,
    FormsModule,
    TranslatePipe,
    MyWorkMissionListComponent,
    AssignWorkMissionListComponent,
  ],
  templateUrl: './work-mission-container.component.html',
  styleUrl: './work-mission-container.component.scss',
})
export default class WorkMissionContainerComponent implements OnInit {
  breadcrumbs: MenuItem[] | undefined;
  home: MenuItem | undefined;
  missions = signal<PaginatedList<WorkMission>>(new PaginatedList<WorkMission>());
  departments = signal<BaseLookupModel[]>([]);
  matDialog = inject(MatDialog);
  dialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);
  authService = inject(AuthService); // 👈 inject here

  canAssign = false;
  ngOnInit() {
    // Set the signal values
    this.missions.set(this.activatedRoute.snapshot.data['list'].missions);
    this.departments.set(this.activatedRoute.snapshot.data['list'].departments);
    this.canAssign = !!(this.authService.isDepartmentManager || this.authService.isHROfficer);
  }
}
