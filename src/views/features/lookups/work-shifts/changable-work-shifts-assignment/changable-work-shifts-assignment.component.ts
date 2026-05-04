import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { MatDialog } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { ChangableWorkShiftsAssignmentPopupComponent } from '../changable-work-shifts-assignment-popup/changable-work-shifts-assignment-popup.component';


@Component({
  selector: 'app-changable-work-shifts-assignment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BreadcrumbModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    TableModule,
    PaginatorModule,
    TranslateModule,
  ],
  templateUrl: './changable-work-shifts-assignment.component.html',
  styleUrl: './changable-work-shifts-assignment.component.scss',
})
export class ChangableWorkShiftsAssignmentComponent implements OnInit {
  home: MenuItem = { icon: 'pi pi-home', label: 'لوحة المعلومات' };
  breadcrumbs: MenuItem[] = [{ label: 'اسناد ورديات العمل' }];

  filterOptions = {
    assignmentId: '',
    startDate: null,
    endDate: null,
    department: null,
    employeeName: null,
    nameAr: '',
    nameEn: '',
    workShiftType: null,
    fkDepartmentId: null,
    fkAssignedUserId: null,
  };

  shiftTypeOptions = [
    { label: 'صباحي', value: 1 },
    { label: 'مسائي', value: 2 },
  ];

  departments = [
    { label: 'الادارة العامة', id: 1 },
    { label: 'ادارة الموارد البشرية', id: 2 },
  ];

  usersProfiles = [
    { label: 'محمد أحمد', id: 1 },
    { label: 'علي حسن', id: 2 },
  ];

  dialog = inject(MatDialog);


  list = [
    {
      id: 1,
      assignmentId: 'Shift-01',
      shifts: ['اسم الوردية الأولى', 'اسم الوردية الثانية', 'اسم الوردية الثالثة'],
      startDate: '2024-12-18',
      endDate: '2024-11-10',
    },
    {
      id: 2,
      assignmentId: 'Shift-01',
      shifts: ['اسم الوردية الأولى', 'اسم الوردية الثانية', 'اسم الوردية الثالثة'],
      startDate: '2024-12-18',
      endDate: '2024-11-10',
    },
    {
      id: 3,
      assignmentId: 'Shift-01',
      shifts: ['اسم الوردية الأولى', 'اسم الوردية الثانية', 'اسم الوردية الثالثة'],
      startDate: '2024-12-18',
      endDate: '2024-11-10',
    },
  ];

  paginationInfo = {
    totalItems: 999,
  };

  first = 0;
  rows = 10;
  optionLabel = 'label';
  startDate: Date | null = null;
  endDate: Date | null = null;

  ngOnInit() {}

  search() {}
  resetSearch() {}
  onPageChange(event: any, flag: boolean) {
    this.first = event.first;
    this.rows = event.rows;
  }
  exportExcel(name: string) {}
  exportPdf(name: string) {}
  getTranslatedFileName(key: string) {
    return 'file';
  }
  addOrEditModel(data?: any) {
    this.dialog.open(ChangableWorkShiftsAssignmentPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
      data: { model: data },
    });
  }

  deleteUserShiftAssignment(id: number) {}
  getShiftTypeName(type: any) {
    return 'ثابتة';
  }
}
