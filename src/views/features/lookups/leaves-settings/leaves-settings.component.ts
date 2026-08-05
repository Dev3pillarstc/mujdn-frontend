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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Component({
  selector: 'app-leaves-settings',
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
  ],
  templateUrl: './leaves-settings.component.html',
  styleUrl: './leaves-settings.component.scss',
})
export default class LeavesSettingsComponent {
  first: number = 0;
  rows: number = 10;
  date2: Date | undefined;
  attendance!: any[];
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };

  matDialog = inject(MatDialog);

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'اعدادات الاجازات' }];
    this.attendance = [
      {
        serialNumber: 1,
        PermanentType: 'دوام كلي',
        startDate: '12/12/2024',
        endDate: '24/12/2024',
        timeRange: '10:00 - 17:00',
        maxAttendanceTime: '09:30',
        maxwithdrawalTime: '19:00',
      },
    ];
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

}
