import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MatDialog } from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { AddTaskPopupComponent } from '../add-task-popup/add-task-popup.component';
import { AssignTaskPopupComponent } from '../assign-task-popup/assign-task-popup.component';
import { TaskDetailsPopupComponent } from '../task-details-popup/task-details-popup.component';
interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-tasks-list',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    Select,
    DatePickerModule,
    FormsModule,
    TabsModule,
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss',
})
export default class TasksListComponent {
  items: MenuItem[] | undefined;
  dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };
  dialog = inject(MatDialog);
  home: MenuItem | undefined;
  date2: Date | undefined;
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  attendance!: any[];
  first: number = 0;
  rows: number = 10;
  matDialog = inject(MatDialog);

  constructor() {}

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'مهام الأعمال و الاسناد' }];
    this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
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
    const dialogRef = this.dialog.open(AddTaskPopupComponent as any, this.dialogSize);

    dialogRef.afterClosed().subscribe();
  }
  openDialog1(): void {
    const dialogRef = this.dialog.open(AssignTaskPopupComponent as any, this.dialogSize);

    dialogRef.afterClosed().subscribe();
  }
  openDialog2(): void {
    const dialogRef = this.dialog.open(TaskDetailsPopupComponent as any, this.dialogSize);

    dialogRef.afterClosed().subscribe();
  }
}
