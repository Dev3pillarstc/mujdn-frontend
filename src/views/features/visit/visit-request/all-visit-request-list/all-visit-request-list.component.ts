import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { QrcodeVisitRequestPopupComponent } from '../qrcode-visit-request-popup/qrcode-visit-request-popup.component';
import { Select } from 'primeng/select';
import { AddEditVisitRequestPopupComponent } from '../add-edit-visit-request-popup/add-edit-visit-request-popup.component';
import { ViewActionVisitRequestPopupComponent } from '../view-action-visit-request-popup/view-action-visit-request-popup.component';
@Component({
  selector: 'app-all-visit-request-list',
  imports: [
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    DatePickerModule,
    FormsModule,
    TabsModule,
    Select,
    DatePicker,
  ],
  templateUrl: './all-visit-request-list.component.html',
  styleUrl: './all-visit-request-list.component.scss',
})
export class AllVisitRequestListComponent {
  first: number = 0;
  rows: number = 10;
  date2: Date | undefined;
  nationalities!: any[];
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  dialogSize2 = {
    width: '100%',
    maxWidth: '1024px',
  };

  matDialog = inject(MatDialog);

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'معايير حظر الزائرين' }];
    // Updated dummy data to match your Arabic table structure
    this.nationalities = [{}];
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
    dialogConfig.width = this.dialogSize2.width;
    dialogConfig.maxWidth = this.dialogSize2.maxWidth;
    const dialogRef = this.matDialog.open(AddEditVisitRequestPopupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      console.log('closed');
    });
  }
  openViewDialog(model?: any) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: model,
    };
    dialogConfig.width = this.dialogSize2.width;
    dialogConfig.maxWidth = this.dialogSize2.maxWidth;
    const dialogRef = this.matDialog.open(
      ViewActionVisitRequestPopupComponent as any,
      dialogConfig
    );

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      console.log('closed');
    });
  }
  openQrcodeDialog(model?: any) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: model,
    };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    const dialogRef = this.matDialog.open(QrcodeVisitRequestPopupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      console.log('closed');
    });
  }
}
