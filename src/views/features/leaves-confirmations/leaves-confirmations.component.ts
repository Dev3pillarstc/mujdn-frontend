import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { LeavesViewPopupComponent } from '../leaves/leaves-view-popup/leaves-view-popup.component';
import { LeavesAddEditPopupComponent } from '../leaves/leaves-add-edit-popup/leaves-add-edit-popup.component';

@Component({
  selector: 'app-leaves-confirmations',
  imports: [
    CommonModule,
    FormsModule,
    Breadcrumb,
    TableModule,
    PaginatorModule,
    DatePickerModule,
    SelectModule,
    InputTextModule,
  ],
  templateUrl: './leaves-confirmations.component.html',
  styleUrl: './leaves-confirmations.component.scss',
})
export default class LeavesConfirmationsComponent {
  first: number = 0;
  rows: number = 10;

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };

  matDialog = inject(MatDialog);

  employees = [{ name: 'احمد محمد عبد المقصود' }, { name: 'عبدالعزيز محمد' }];

  departments = [{ name: 'ادارة خارجية' }, { name: 'ادارة داخلية' }];

  leaveTypes = [{ name: 'اجازة مرضية' }, { name: 'اجازة سنوية' }, { name: 'اجازة اضطرارية' }];

  requestStatuses = [{ name: 'جديد' }, { name: 'موافقة' }, { name: 'رفض' }];

  leaves = [
    {
      nationalId: '8956781235',
      department: 'ادارة خارجية',
      employeeName: 'احمد محمد عبد المقصود',
      leaveType: 'اجازة مرضية',
      dateFrom: '3/8/2026',
      dateTo: '15/8/2026',
      status: 'new',
    },
    {
      nationalId: '8956781235',
      department: 'ادارة خارجية',
      employeeName: 'احمد محمد عبد المقصود',
      leaveType: 'اجازة مرضية',
      dateFrom: '3/8/2026',
      dateTo: '15/8/2026',
      status: 'approved',
    },
    {
      nationalId: '8956781235',
      department: 'ادارة خارجية',
      employeeName: 'احمد محمد عبد المقصود',
      leaveType: 'اجازة مرضية',
      dateFrom: '3/8/2026',
      dateTo: '15/8/2026',
      status: 'rejected',
    },
  ];

  ngOnInit() {
    this.items = [
      { label: 'لوحة المعلومات' },
      { label: 'الاجازات' },
      { label: 'اعتماد طلبات الاجازات' },
    ];
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  openDialog(model?: any) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: model,
    };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    const dialogRef = this.matDialog.open(LeavesViewPopupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe(() => {
      console.log('closed');
    });
  }

  openAddEditDialog(model?: any) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: model,
    };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    const dialogRef = this.matDialog.open(LeavesAddEditPopupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe(() => {
      console.log('closed');
    });
  }
}
