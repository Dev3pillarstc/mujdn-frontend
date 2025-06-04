import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-employee-list',
  imports: [
    Breadcrumb,
    FormsModule,
    Select,
    DatePickerModule,
    FluidModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export default class EmployeeListComponent {
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;
  adminstrations: Adminstration[] | undefined;

  selectedAdminstration: Adminstration | undefined;
  date2: Date | undefined;
  attendance!: any[];
  first: number = 0;
  rows: number = 10;

  ngOnInit() {
    this.items = [
      { label: 'لوحة المعلومات' },
      { label: 'قائمة الموظفين' },
    ];
    this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
    // Updated dummy data to match your Arabic table structure
    this.attendance = [
      {
        serialNumber: 1,
        employeeName: 'محمد أحمد طه',
        date: '12/12/2023',
        time: '08:00 ص',
        workType: 'دوام كلي',
        attendanceStatus: 'حضور',
        department: 'الإدارة الرئيسية',
        movement: 'محمود ',
        treatmentStatus: 'تمت المعالجة',
      },
      {
        serialNumber: 2,
        employeeName: 'محمد أحمد طه',
        date: '12/12/2023',
        time: '12:00 م',
        workType: 'دوام كلي',
        attendanceStatus: 'انصراف',
        department: 'مجهول',
        movement: 'محمود ',
        treatmentStatus: 'تمت المعالجة',
      },
      {
        serialNumber: 3,
        employeeName: 'محمد أحمد طه',
        date: '12/12/2023',
        time: '08:00 ص',
        workType: 'دوام جزئي',
        attendanceStatus: 'حضور',
        department: 'الإدارة الرئيسية',
        movement: 'محمود',
        treatmentStatus: 'قيد المعالجة',
      },
      {
        serialNumber: 4,
        employeeName: 'فاطمة علي محمد',
        date: '13/12/2023',
        time: '08:30 ص',
        workType: 'دوام كلي',
        attendanceStatus: 'حضور',
        department: 'الإدارة الرئيسية',
        movement: 'محمود ',
        treatmentStatus: 'تمت المعالجة',
      },
      {
        serialNumber: 5,
        employeeName: 'أحمد محمود سالم',
        date: '13/12/2023',
        time: '09:00 ص',
        workType: 'دوام كلي',
        attendanceStatus: 'غياب',
        department: 'الإدارة الفرعية',
        movement: 'محمود',
        treatmentStatus: 'تمت المعالجة',
      },
    ];
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
