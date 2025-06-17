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
import { EmployeePermissionPopupComponent } from '../popups/employee-permission-popup/employee-permission-popup.component';
import { AssignShiftPopupComponent } from '../popups/assign-shift-popup/assign-shift-popup.component';
import { AddNewEmployeePopupComponent } from '../popups/add-new-employee-popup/add-new-employee-popup.component';
import { AddTaskPopupComponent } from '../popups/add-task-popup/add-task-popup.component';
import { TasksAssignedToEmployeePopupComponent } from '../popups/tasks-assigned-to-employee-popup/tasks-assigned-to-employee-popup.component';
import { AttendanceReportPopupComponent } from '../popups/attendance-report-popup/attendance-report-popup.component';

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

  // openMainModal() {
  //   const dialogRef = this.matDialog.open(EmployeePopupComponent, this.dialogSize);

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }
  openEmployeePermissionModal() {
    const dialogRef = this.matDialog.open(EmployeePermissionPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  assignShiftPopup() {
    const dialogRef = this.matDialog.open(AssignShiftPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  addNewEmployeePopup() {
    const dialogRef = this.matDialog.open(AddNewEmployeePopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  assignTaskPopup() {
    const dialogRef = this.matDialog.open(AddTaskPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  tasksAssignedToEmployee() {
    const dialogRef = this.matDialog.open(TasksAssignedToEmployeePopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  attendanceReportPopup() {
    const dialogRef = this.matDialog.open(AttendanceReportPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  constructor() {
    this.itemsList = [
      {
        label: 'تعديل بيانات الموظف',
        command: () => this.addNewEmployeePopup(),
      },
      {
        separator: true,
      },
      {
        label: 'عرض تقرير الحضور و الانصراف',
        command: () => this.attendanceReportPopup(),
      },
      {
        separator: true,
      },
      {
        label: 'اسنادة مهمة',
        command: () => this.assignTaskPopup(),
      },
      {
        separator: true,
      },
      {
        label: 'اسناد وردية',
        command: () => this.assignShiftPopup(),
      },
      {
        separator: true,
      },
      {
        label: 'سجل المهمات المسندة للموظف',
        command: () => this.tasksAssignedToEmployee(),
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

  openConfirmation() {
    const dialogRef = this.service.open({
      icon: 'warning',
      messages: ['COMMON.CONFIRM_DELETE'],
      confirmText: 'COMMON.OK',
      cancelText: 'COMMON.CANCEL',
    });

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
