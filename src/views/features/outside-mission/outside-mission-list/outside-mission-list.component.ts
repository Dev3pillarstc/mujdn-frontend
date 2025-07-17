import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { AddNewMissionPopupComponent } from '../popups/add-new-mission-popup/add-new-mission-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ViewMissionDataPopupComponent } from '../popups/view-mission-data-popup/view-mission-data-popup.component';
import { Select } from 'primeng/select';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-outside-mission-list',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    DatePickerModule,
    Select,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './outside-mission-list.component.html',
  styleUrl: './outside-mission-list.component.scss',
})
export default class OutsideMissionListComponent {
  first: number = 0;
  rows: number = 10;
  date2: Date | undefined;
  missions!: any[];
  breadcrumbs: MenuItem[] | undefined;
  home: MenuItem | undefined;
  matDialog = inject(MatDialog);

  ngOnInit() {
    this.breadcrumbs = [{ label: 'لوحة المعلومات' }, { label: 'مهام الأعمال و الاسناد' }];
    // Updated dummy data to match your Arabic table structure
    this.missions = [
      {
        taskName: 'حراسة البوابات',
        startDate: '12/12/2024',
        endDate: '18/12/2024',
        taskPredicate: 'محمود أيمن',

        actions: ['view'],
      },
      {
        taskName: 'حراسة البوابات',
        startDate: '12/12/2023',
        endDate: '18/12/2023',
        taskPredicate: 'محمود أيمن',
        actions: ['view'],
      },
      {
        taskName: 'حراسة البوابات',
        startDate: '12/12/2025',
        endDate: '18/12/2025',
        taskPredicate: 'محمود أيمن',

        actions: ['delete', 'edit', 'view'],
      },
      {
        taskName: 'حراسة البوابات',
        startDate: '12/12/2024',
        endDate: '18/12/2024',
        taskPredicate: 'محمود أيمن',

        actions: ['view'],
      },
    ];
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
  addNewMission() {
    const dialogRef = this.matDialog.open(AddNewMissionPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe();
  }
  viewMission() {
    const dialogRef = this.matDialog.open(ViewMissionDataPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe();
  }
}
