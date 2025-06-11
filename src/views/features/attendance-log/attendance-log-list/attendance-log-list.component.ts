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
import { AttendanceLogPopupComponent } from '@/views/features/attendance-log/attendance-log-popup/attendance-log-popup.component';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-attendance-log-list',
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
  templateUrl: './attendance-log-list.component.html',
  styleUrl: './attendance-log-list.component.scss',
})
export default class AttendanceLogListComponent
  extends BaseListComponent<AttendanceLogPopupComponent>
  implements OnInit
{
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
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
      { label: 'حركات حضور و انصراف الموظفين' },
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

  override openDialog(): void {
    this.openBaseDialog(AttendanceLogPopupComponent as any);
  }
}
