import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-attendance-report-popup',
  imports: [PaginatorModule, TableModule, CommonModule, DatePickerModule,FormsModule],
  templateUrl: './attendance-report-popup.component.html',
  styleUrl: './attendance-report-popup.component.scss',
})
export class AttendanceReportPopupComponent extends BasePopupComponent implements OnInit {
  first: number = 0;
  rows: number = 10;
  date2: Date | undefined;

  attendance!: any[];
  ngOnInit() {
    this.attendance = [
      {
        day: 'السبت',
        date: '05/06/1445',
        checkIn: '00:00',
        checkOut: '00:00',
        permission: '00:00',
        delay: '15:00',
        permissionCount: '3 مرات',
        noResponseCount: 2,
        status: 'عطلة',
      },
      {
        day: 'الأحد',
        date: '05/06/1445',
        checkIn: '08:00',
        checkOut: '17:00',
        permission: '00:00',
        delay: '15:00',
        permissionCount: '0 مره',
        noResponseCount: 0,
        status: 'غياب',
      },
      {
        day: 'الاثنين',
        date: '05/06/1445',
        checkIn: '00:00',
        checkOut: '00:00',
        permission: '00:00',
        delay: '00:00',
        permissionCount: '3 مرات',
        noResponseCount: 1,
        status: 'مهمة عمل',
      },
      {
        day: 'الثلاثاء',
        date: '05/06/1445',
        checkIn: '08:00',
        checkOut: '17:00',
        permission: '00:00',
        delay: '15:00',
        permissionCount: '3 مرات',
        noResponseCount: 3,
        status: 'دوام',
      },
      {
        day: 'الاربعاء',
        date: '05/06/1445',
        checkIn: '08:00',
        checkOut: '17:00',
        permission: '00:00',
        delay: '15:00',
        permissionCount: '0 مره',
        noResponseCount: 0,
        status: 'دوام',
      },
      {
        day: 'الخميس',
        date: '05/06/1445',
        checkIn: '08:00',
        checkOut: '17:00',
        permission: '00:00',
        delay: '15:00',
        permissionCount: '3 مرات',
        noResponseCount: 2,
        status: 'دوام',
      },
      {
        day: 'الجمعة',
        date: '05/06/1445',
        checkIn: '00:00',
        checkOut: '00:00',
        permission: '00:00',
        delay: '00:00',
        permissionCount: '0 مره',
        noResponseCount: 0,
        status: 'عطلة',
      },
    ];
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
