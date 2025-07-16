import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-holidays',
  imports: [
    Breadcrumb,
    FormsModule,
    DatePickerModule,
    FluidModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
  ],
  templateUrl: './employee-holidays.component.html',
  styleUrl: './employee-holidays.component.scss',
})
export default class EmployeeHolidaysComponent {
  first: number = 0;
  rows: number = 10;
  matDialog = inject(MatDialog);
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  date2: Date | undefined;
  attendance!: any[];

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'قائمة الاجازات' }];
    this.attendance = [
      {
        serialNumber: 'عيد الأضحى المبارك',
        employeeName: '12/06/2024 - 17/06/2024',
        date: 'هنا يكون محتوى الملاحظات',
      },
      {
        serialNumber: 'عيد الأضحى المبارك',
        employeeName: '12/06/2024 - 17/06/2024',
        date: 'هنا يكون محتوى الملاحظات',
      },
      {
        serialNumber: 'عيد الأضحى المبارك',
        employeeName: '12/06/2024 - 17/06/2024',
        date: 'هنا يكون محتوى الملاحظات',
      },
      {
        serialNumber: 'عيد الأضحى المبارك',
        employeeName: '12/06/2024 - 17/06/2024',
        date: 'هنا يكون محتوى الملاحظات',
      },
    ];
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
