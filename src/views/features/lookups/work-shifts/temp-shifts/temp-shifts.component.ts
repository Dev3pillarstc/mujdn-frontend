import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { WorkDaysPopupComponent } from '../work-days-popup/work-days-popup.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-temp-shifts',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    DatePickerModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './temp-shifts.component.html',
  styleUrl: './temp-shifts.component.scss',
})
export default class TempShiftsComponent {
  first: number = 0;
  rows: number = 10;
  date2: Date | undefined;
  attendance!: any[];
  breadcrumbs: MenuItem[] | undefined;
  home: MenuItem | undefined;

  dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  dialog = inject(MatDialog);

  ngOnInit() {
    this.breadcrumbs = [{ label: 'لوحة المعلومات' }, { label: 'وردياتي المؤقتة' }];
    // Updated dummy data to match your Arabic table structure
    this.attendance = [
      {
        serialNumber: 1,
        PermanentType: 'دوام كلي',
        startDate: '12/12/2024',
        endDate: '24/12/2024',
        timeRange: '10:00 - 17:00',
        maxAttendanceTime: '09:30',
        maxwithdrawalTime: '19:00',
      },
    ];
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(WorkDaysPopupComponent as any, this.dialogSize);

    dialogRef.afterClosed().subscribe();
  }
}
