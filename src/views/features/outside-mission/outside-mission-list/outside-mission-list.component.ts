import { Component, inject, OnInit, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { AddNewMissionPopupComponent } from '../popups/add-new-mission-popup/add-new-mission-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewMissionDataPopupComponent } from '../popups/view-mission-data-popup/view-mission-data-popup.component';
import { TranslatePipe } from '@ngx-translate/core';
import { AssignEmployeesComponent } from '../popups/assign-employees/assign-employees.component';
import { TabsModule } from 'primeng/tabs';
import { Select } from 'primeng/select';
import { SplitButton } from 'primeng/splitbutton';
import { MyMissionsTabComponent } from '../my-missions-tab/my-missions-tab.component';
import { AssignAndViewMissionsTabComponent } from '../assign-and-view-missions-tab/assign-and-view-missions-tab.component';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { WorkMission } from '@/models/features/business/work-mission';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { UserProfileDataWithNationalId } from '@/models/features/business/user-profile-data-with-national-id';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';

@Component({
  selector: 'app-outside-mission-list',
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
    Select,
    SplitButton,
    MyMissionsTabComponent,
    AssignAndViewMissionsTabComponent,
  ],
  templateUrl: './outside-mission-list.component.html',
  styleUrl: './outside-mission-list.component.scss',
})
export default class OutsideMissionListComponent implements OnInit {
  breadcrumbs: MenuItem[] | undefined;
  home: MenuItem | undefined;
  missions = signal<PaginatedList<WorkMission>>(new PaginatedList<WorkMission>());
  assignableEmployees = signal<PaginatedListResponseData<UserProfileDataWithNationalId>>(
    new PaginatedListResponseData<UserProfileDataWithNationalId>()
  );
  departments = signal<BaseLookupModel[]>([]);
  matDialog = inject(MatDialog);
  dialog = inject(MatDialog);
  activatedRoute = inject(ActivatedRoute);
  ngOnInit() {
    // Set the signal values
    this.missions.set(this.activatedRoute.snapshot.data['list'].missions);
    this.assignableEmployees.set(this.activatedRoute.snapshot.data['list'].assignableEmployees);
    this.departments.set(this.activatedRoute.snapshot.data['list'].departments);
  }
}
