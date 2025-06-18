import { DepartmentPopupComponent } from '../department-popup/department-popup.component';
import { Component, OnInit } from '@angular/core';
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
import { inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DepartmentHeaderComponent } from '../department-header/department-header.component';
import { DepartmentTreeComponent } from '../department-tree/department-tree.component';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-department-list',
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
    Select,
    DepartmentHeaderComponent,
    DepartmentTreeComponent,
  ],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
})
export default class DepartmentListComponent {
  first: number = 0;
  rows: number = 10;
  matDialog = inject(MatDialog);
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  date2: Date | undefined;
  attendance!: any[];
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'ادارة المجاهدين' }];
    // Updated dummy data to match your Arabic table structure
    this.attendance = [
      {
        serialNumber: 1,
        employeeName: 'عيد الأضحى المبارك',
        date: '12/12/2023',
      },
    ];
  }
  openDialog() {
    const dialogRef = this.matDialog.open(DepartmentPopupComponent, {
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
