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
import { Select } from 'primeng/select';
import { TranslatePipe } from '@ngx-translate/core';
import { DevicesConfigurationModalComponent } from '../devices-configuration-modal/devices-configuration-modal.component';

interface Adminstration {
  type: string;
}
@Component({
  selector: 'app-devices-configuration',
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
  templateUrl: './devices-configuration.component.html',
  styleUrl: './devices-configuration.component.scss',
})
export default class DevicesConfigurationComponent {
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
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  ngOnInit() {
    this.breadcrumbs = [{ label: 'لوحة المعلومات' }, { label: 'تعريف و ربط أجهزة البصمة' }];
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
  openModal() {
    const dialogRef = this.matDialog.open(DevicesConfigurationModalComponent, {
      width: '100%',
      maxWidth: '600px',
    });

    dialogRef.afterClosed().subscribe();
  }
}
