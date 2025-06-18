import { Component, inject, OnInit } from '@angular/core';
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
import { UserService } from '@/services/features/user.serice';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { User } from '@/models/auth/user';
import { UserFilter } from '@/models/auth/user-filter';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { TranslatePipe } from '@ngx-translate/core';

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
    TranslatePipe,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  providers: [MessageService],
})
export default class EmployeeListComponent
  extends BaseListComponent<User, AddNewEmployeePopupComponent, UserService, UserFilter>
  implements OnInit
{
  userService = inject(UserService);
  home: MenuItem | undefined;
  filterModel: UserFilter = new UserFilter();
  // items: MenuItem[] | undefined;
  itemsList: MenuItem[] = [
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
      // command: () => this.openConfirmation(),
    },
  ];

  adminstrations: Adminstration[] | undefined;

  selectedAdminstration: Adminstration | undefined;
  joinDate: Date | undefined;
  // attendance!: any[];
  // first: number = 0;
  // rows: number = 10;
  // matDialog = inject(MatDialog);
  // confirmationService = inject(ConfirmationService);
  // alertService = inject(AlertService);

  override dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };

  override openDialog(user: User): void {
    this.openBaseDialog(AddNewEmployeePopupComponent as any, user);
  }

  override get service() {
    return this.userService;
  }
  addOrEditModel(nationality?: User) {
    nationality = nationality || new User();
    this.openDialog(nationality);
  }

  // constructor() {
  //   this.itemsList = [
  //     {
  //       label: 'تعديل بيانات الموظف',
  //       command: () => this.addNewEmployeePopup(),
  //     },
  //     {
  //       separator: true,
  //     },
  //     {
  //       label: 'عرض تقرير الحضور و الانصراف',
  //       command: () => this.attendanceReportPopup(),
  //     },
  //     {
  //       separator: true,
  //     },
  //     {
  //       label: 'اسنادة مهمة',
  //       command: () => this.assignTaskPopup(),
  //     },
  //     {
  //       separator: true,
  //     },
  //     {
  //       label: 'اسناد وردية',
  //       command: () => this.assignShiftPopup(),
  //     },
  //     {
  //       separator: true,
  //     },
  //     {
  //       label: 'سجل المهمات المسندة للموظف',
  //       command: () => this.tasksAssignedToEmployee(),
  //     },
  //     {
  //       separator: true,
  //     },
  //     {
  //       label: 'حذف الموظف',
  //       styleClass: 'p-menuitem-danger',
  //       command: () => this.openConfirmation(),
  //     },
  //   ];
  // }

  // }
  openEmployeePermissionModal() {
    const dialogRef = this.matDialog.open(EmployeePermissionPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe();
  }

  assignShiftPopup() {
    const dialogRef = this.matDialog.open(AssignShiftPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe();
  }

  addNewEmployeePopup() {
    const dialogRef = this.matDialog.open(AddNewEmployeePopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe();
  }

  assignTaskPopup() {
    const dialogRef = this.matDialog.open(AddTaskPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe();
  }

  tasksAssignedToEmployee() {
    const dialogRef = this.matDialog.open(TasksAssignedToEmployeePopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe();
  }

  attendanceReportPopup() {
    const dialogRef = this.matDialog.open(AttendanceReportPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe();
  }

  // ngOnInit() {
  //   this.items = [{ label: 'لوحة المعلومات' }, { label: 'قائمة الموظفين' }];
  //   this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
  //   // Updated dummy data to match your Arabic table structure
  //   this.attendance = [
  //     {
  //       serialNumber: 1,
  //       employeeNameAr: 'محمد أحمد طه',
  //       employeeNameEn: 'mohamed taha',
  //       adminstration: 'إدارة الموارد',
  //       jop: 'موظف',
  //       PermanentType: 'دوام كلي',
  //       date: '12/12/2024',
  //     },
  //   ];
  // }

  // onPageChange(event: PaginatorState) {
  //   this.first = event.first ?? 0;
  //   this.rows = event.rows ?? 10;
  // }

  // openConfirmation() {
  //   const dialogRef = this.service.open({
  //     icon: 'warning',
  //     messages: ['COMMON.CONFIRM_DELETE'],
  //     confirmText: 'COMMON.OK',
  //     cancelText: 'COMMON.CANCEL',
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result == DIALOG_ENUM.OK) {
  //       // User confirmed
  //       this.alertService.showSuccessMessage({ messages: ['COMMON.DELETED_SUCCESSFULLY'] });
  //     } else {
  //       // User canceled
  //       this.alertService.showErrorMessage({ messages: ['COMMON.DELETION_FAILED'] });
  //     }
  //   });
  // }
}
