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
import { MatDialog } from '@angular/material/dialog';
import { HolidaysPopupComponent } from '../holidays-popup/holidays-popup.component';
import { inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

interface Adminstration {
  type: string;
}
@Component({
  selector: 'app-home',
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
    InputTextModule,
  ],
  templateUrl: './holidays-list.component.html',
  styleUrl: './holidays-list.component.scss',
})
export default class HolidaysListComponent {
  first: number = 0;
  rows: number = 10;
  matDialog = inject(MatDialog);
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  date2: Date | undefined;
  attendance!: any[];

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'قائمة الاجازات و الأعياد' }];
    this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
    // Updated dummy data to match your Arabic table structure
    this.attendance = [
      {
        serialNumber: 1,
        employeeName: 'عيد الأضحى المبارك',
        date: '12/12/2023',
        time: '12/12/2023',
      },
    ];
  }

  openDialog() {
    const dialogRef = this.matDialog.open(HolidaysPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
