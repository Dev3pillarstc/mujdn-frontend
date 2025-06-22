import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddPermissionPopupComponent } from '../popups/add-permission-popup/add-permission-popup.component';
import { TabsModule } from 'primeng/tabs';
import { PermissionsDataPopupComponent } from '../popups/permissions-data-popup/permissions-data-popup.component';

interface Adminstration {
  type: string;
}

@Component({
  selector: 'app-permissions-list',
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
    PaginatorModule,
    TabsModule,
  ],
  templateUrl: './permissions-list.component.html',
  styleUrl: './permissions-list.component.scss',
})
export default class PermissionsListComponent implements OnInit {
  dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };
  items: MenuItem[] | undefined;
  dialog = inject(MatDialog);
  home: MenuItem | undefined;
  adminstrations: Adminstration[] | undefined;

  selectedAdminstration: Adminstration | undefined;
  date2: Date | undefined;
  permissions!: any[];
  permissionsRequest!: any[];
  first: number = 0;
  rows: number = 10;

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'الاستئذانات' }];
    this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
    // Updated dummy data to match your Arabic table structure
    this.permissions = [
      {
        id: 1,
        requestType: 'محدود المدة',
        managerName: 'محمد محمود أحمد يس',
        requestDate: '12/12/2024',
        duration: '30 دقيقة',
        status: 'موافقة',
        canEdit: false,
        canDelete: false,
        canView: true,
      },
      {
        id: 2,
        requestType: 'محدود المدة',
        managerName: 'محمد محمود أحمد يس',
        requestDate: '12/12/2024',
        duration: '30 دقيقة',
        status: 'تحت المعالجة',
        canEdit: true,
        canDelete: true,
        canView: false,
      },
      {
        id: 3,
        requestType: 'محدود المدة',
        managerName: 'محمد محمود أحمد يس',
        requestDate: '12/12/2024',
        duration: '30 دقيقة',
        status: 'مرفوض',
        canEdit: false,
        canDelete: false,
        canView: true,
      },
    ];
    this.permissionsRequest = [
      {
        id: 1,
        requestType: 'محدود المدة',
        employeeName: 'محمد محمود أحمد يس',
        requestDate: '12/12/2024',
        duration: '30 دقيقة',
        status: 'جديد',
        canEdit: true,
        canDelete: false,
        canView: false,
      },
      {
        id: 2,
        requestType: 'محدود المدة',
        employeeName: 'محمد محمود أحمد يس',
        requestDate: '12/12/2024',
        duration: '30 دقيقة',
        status: 'مرفوض',
        canView: true,
        canDelete: false,
        canEdit: false,
      },
      {
        id: 3,
        requestType: 'محدود المدة',
        employeeName: 'محمد محمود أحمد يس',
        requestDate: '12/12/2024',
        duration: '30 دقيقة',
        status: 'موافقة',
        canView: true,
        canDelete: false,
        canEdit: false,
      },
    ];
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  openAddpermissionDialog(): void {
    const dialogRef = this.dialog.open(AddPermissionPopupComponent as any, this.dialogSize);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openPermissionsDataDialog(): void {
    const dialogRef = this.dialog.open(PermissionsDataPopupComponent as any, this.dialogSize);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
