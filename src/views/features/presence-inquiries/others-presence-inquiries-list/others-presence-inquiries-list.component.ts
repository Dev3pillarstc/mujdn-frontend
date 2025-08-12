import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MenuItem } from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { AssignEmployeeResponsibilityPopupComponent } from '../assign-employee-responsibility-popup/assign-employee-responsibility-popup.component';
import { PresenceInquiriesPopupComponent } from '../presence-inquiries-popup/presence-inquiries-popup.component';
import { ViewEmployeesCheckPopupComponent } from '../view-employees-check-popup/view-employees-check-popup.component';
interface Adminstration {
  type: string;
}
@Component({
  selector: 'app-others-presence-inquiries-list',
  imports: [
    InputTextModule,
    CommonModule,
    PaginatorModule,
    Select,
    DatePickerModule,
    TabsModule,
    TableModule,
    FormsModule,
  ],
  templateUrl: './others-presence-inquiries-list.component.html',
  styleUrl: './others-presence-inquiries-list.component.scss',
})
export class OthersPresenceInquiriesListComponent {
  attendance!: any[];
  first: number = 0;
  rows: number = 10;
  breadcrumbs: MenuItem[] | undefined;
  dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };
  dialog = inject(MatDialog);
  home: MenuItem | undefined;
  date2: Date | undefined;
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;

  ngOnInit() {
    this.breadcrumbs = [{ label: 'لوحة المعلومات' }, { label: 'مسائلات توثيق التواجد' }];
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
    const dialogRef = this.dialog.open(PresenceInquiriesPopupComponent as any, this.dialogSize);

    dialogRef.afterClosed().subscribe();
  }
  openDialog1(): void {
    const dialogRef = this.dialog.open(
      AssignEmployeeResponsibilityPopupComponent as any,
      this.dialogSize
    );

    dialogRef.afterClosed().subscribe();
  }
  openDialog2(): void {
    const dialogRef = this.dialog.open(ViewEmployeesCheckPopupComponent as any, this.dialogSize);

    dialogRef.afterClosed().subscribe();
  }
}
