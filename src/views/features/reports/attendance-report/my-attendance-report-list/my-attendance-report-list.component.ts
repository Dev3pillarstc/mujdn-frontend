import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-my-attendance-report-list',
  imports: [
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    DatePickerModule,
    FormsModule,
    Select,
  ],
  templateUrl: './my-attendance-report-list.component.html',
  styleUrl: './my-attendance-report-list.component.scss',
})
export class MyAttendanceReportListComponent {
  first: number = 0;
  rows: number = 10;
  date2: Date | undefined;
  attendance!: any[];
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'ورديات العمل المؤقتة' }];
    // Updated dummy data to match your Arabic table structure
    this.attendance = [{}];
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
