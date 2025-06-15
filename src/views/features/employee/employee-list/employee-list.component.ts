import { Component, inject } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MatDialog } from '@angular/material/dialog';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { ConfirmationService } from '@/services/shared/confirmation.service';
import { AlertService } from '@/services/shared/alert.service';

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
    SplitButtonModule,
    PaginatorModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  providers: [MessageService],
})
export default class EmployeeListComponent {
  items: MenuItem[] | undefined;
  itemsList: MenuItem[];

  home: MenuItem | undefined;
  adminstrations: Adminstration[] | undefined;

  selectedAdminstration: Adminstration | undefined;
  date2: Date | undefined;
  attendance!: any[];
  first: number = 0;
  rows: number = 10;
  matDialog = inject(MatDialog);
  service = inject(ConfirmationService);
  alertService = inject(AlertService);

  constructor() {
    this.itemsList = [
      {
        label: 'تعديل بيانات الموظف',
      },
      {
        separator: true,
      },
      {
        label: 'عرض تقرير الحضور و الانصراف',
      },
      {
        separator: true,
      },
      {
        label: 'اسنادة مهمة',
      },
      {
        separator: true,
      },
      {
        label: 'اسناد وردية',
      },
      {
        separator: true,
      },
      {
        label: 'سجل المهمات المسندة للموظف',
      },
      {
        separator: true,
      },
      {
        label: 'حذف الموظف',
        styleClass: 'p-menuitem-danger',
        command: () => this.openConfirmation(),
      },
    ];
  }

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'قائمة الموظفين' }];
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

  openConfirmation() {
    const dialogRef = this.service.open(['COMMON.CONFIRM_DELETE'], 'COMMON.OK', 'COMMON.CANCEL');

    dialogRef.afterClosed().subscribe((result) => {
      if (result == DIALOG_ENUM.OK) {
        // User confirmed
        this.alertService.showSuccessMessage({ messages: ['COMMON.DELETED_SUCCESSFULLY'] });
      } else {
        // User canceled
        this.alertService.showErrorMessage({ messages: ['COMMON.DELETION_FAILED'] });
      }
    });
  }
}
