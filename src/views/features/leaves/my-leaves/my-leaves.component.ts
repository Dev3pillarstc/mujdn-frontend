import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LeavesViewPopupComponent } from '../leaves-view-popup/leaves-view-popup.component';
import { DatePickerModule } from 'primeng/datepicker';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-my-leaves',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    DatePickerModule,
    SelectModule,
  ],
  templateUrl: './my-leaves.component.html',
  styleUrl: './my-leaves.component.scss',
})
export class MyLeavesComponent {
  first: number = 0;
  rows: number = 10;

  dialogSize = {
    width: '100%',
    maxWidth: '1024px',
  };

  matDialog = inject(MatDialog);

  leaveTypes = [{ name: 'اجازة مرضية' }, { name: 'اجازة سنوية' }, { name: 'اجازة اضطرارية' }];

  requestStatuses = [{ name: 'جديد' }, { name: 'موافقة' }, { name: 'رفض' }];

  leaves = [
    {
      nationalId: '8956781235',
      department: 'ادارة خارجية',
      employeeName: 'عبدالعزيز محمد',
      leaveType: 'اجازة مرضية',
      dateFrom: '3/8/2026',
      dateTo: '15/8/2026',
      status: 'new',
    },
    {
      nationalId: '8956781235',
      department: 'ادارة خارجية',
      employeeName: 'عبدالعزيز محمد',
      leaveType: 'اجازة مرضية',
      dateFrom: '3/8/2026',
      dateTo: '15/8/2026',
      status: 'approved',
    },
    {
      nationalId: '8956781235',
      department: 'ادارة خارجية',
      employeeName: 'عبدالعزيز محمد',
      leaveType: 'اجازة مرضية',
      dateFrom: '3/8/2026',
      dateTo: '15/8/2026',
      status: 'rejected',
    },
  ];

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
}
