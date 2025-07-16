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
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { WorkShiftsAssignmentPopupComponent } from '../work-shifts-assignment-popup/work-shifts-assignment-popup.component';
import UserWorkShift from '@/models/features/lookups/work-shifts/user-work-shifts';
import { UserWorkShiftService } from '@/services/features/lookups/user-workshift.service';
import ShiftsFilter from '@/models/features/lookups/work-shifts/shifts-filter';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
interface Adminstration {
  type: string;
}
@Component({
  selector: 'app-work-shifts-assignment',
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
  ],
  templateUrl: './work-shifts-assignment.component.html',
  styleUrl: './work-shifts-assignment.component.scss',
})
export default class WorkShiftsAssignmentComponent extends BaseListComponent<UserWorkShift, WorkShiftsAssignmentPopupComponent, UserWorkShiftService, ShiftsFilter> {
  override get filterModel(): ShiftsFilter {
    throw new Error('Method not implemented.');
  }
  override set filterModel(val: ShiftsFilter) {
    throw new Error('Method not implemented.');
  }
  override get service(): UserWorkShiftService {
    return this.UserWorkShiftService;
  }
  override initListComponent(): void {
    throw new Error('Method not implemented.');
  }
  protected override mapModelToExcelRow(model: UserWorkShift): { [key: string]: any; } {
    throw new Error('Method not implemented.');
  }
  // items: MenuItem[] | undefined;
  dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };
  UserWorkShiftService = inject(UserWorkShiftService);
  dialog = inject(MatDialog);
  home: MenuItem | undefined;
  date2: Date | undefined;
  adminstrations: Adminstration[] | undefined;
  selectedAdminstration: Adminstration | undefined;
  attendance!: any[];
  // first: number = 0;
  // rows: number = 10;
  // matDialog = inject(MatDialog);

  // constructor() { }

  override ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'اسناد ورديات عمل' }];
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

  // onPageChange(event: PaginatorState) {
  //   this.first = event.first ?? 0;
  //   this.rows = event.rows ?? 10;
  // }
  openDialog(): void {
    const dialogRef = this.dialog.open(WorkShiftsAssignmentPopupComponent as any, this.dialogSize);

    dialogRef.afterClosed().subscribe();
  }
}
