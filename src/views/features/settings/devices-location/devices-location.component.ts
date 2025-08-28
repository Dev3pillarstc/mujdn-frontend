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
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { DevicesLocationModalComponent } from '../devices-location-modal/devices-location-modal.component';

@Component({
  selector: 'app-devices-location',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    DatePickerModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './devices-location.component.html',
  styleUrl: './devices-location.component.scss',
})
export default class DevicesLocationComponent {
  dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  first: number = 0;
  rows: number = 10;
  date2: Date | undefined;
  missions!: any[];
  breadcrumbs: MenuItem[] | undefined;
  home: MenuItem | undefined;
  matDialog = inject(MatDialog);
  dialog = inject(MatDialog);

  ngOnInit() {
    this.breadcrumbs = [{ label: 'لوحة المعلومات' }, { label: 'مواقع أجهزة البصمة' }];
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
  openDialog() {
    const dialogRef = this.matDialog.open(DevicesLocationModalComponent, {
      width: '100%',
      maxWidth: '600px',
    });

    dialogRef.afterClosed().subscribe();
  }
}
