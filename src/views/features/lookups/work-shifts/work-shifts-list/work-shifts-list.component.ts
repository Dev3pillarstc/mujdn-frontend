import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MatDialog } from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { WorkShiftsListPopupComponent } from '../work-shifts-list-popup/work-shifts-list-popup.component';

@Component({
  selector: 'app-work-shifts-list',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
  ],
  templateUrl: './work-shifts-list.component.html',
  styleUrl: './work-shifts-list.component.scss',
})
export default class WorkShiftsListComponent {
  items: MenuItem[] | undefined;
  dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };
  dialog = inject(MatDialog);
  home: MenuItem | undefined;
  date2: Date | undefined;
  attendance!: any[];
  first: number = 0;
  rows: number = 10;
  matDialog = inject(MatDialog);

  constructor() {}

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'ورديات العمل' }];
    // Updated dummy data to match your Arabic table structure
    this.attendance = [
      {
        serialNumber: 1,
        employeeNameAr: 'محمد أحمد طه',
        employeeNameEn: 'mohamed taha',
        adminstration: 'إدارة الموارد',
        jop: 'موظف',
        PermanentType: 'دوام كلي',
        date: '12/12/2024',
      },
    ];
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(WorkShiftsListPopupComponent as any, this.dialogSize);

    dialogRef.afterClosed().subscribe();
  }
}
