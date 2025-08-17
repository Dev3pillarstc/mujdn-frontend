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
import { TranslatePipe } from '@ngx-translate/core';
import { Visit } from '@/models/features/visit/visit';
import { VisitService } from '@/services/features/visit/visit.service';
import { VisitFilter } from '@/models/features/visit/visit-filter';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
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
    TranslatePipe,
  ],
  templateUrl: './all-visit-request-list.component.html',
  styleUrl: './all-visit-request-list.component.scss',
})
export class AllVisitRequestListComponent extends BaseListComponent<
  Visit,
  AddEditVisitRequestPopupComponent,
  VisitService,
  VisitFilter
> {
  override get filterModel(): VisitFilter {
    throw new Error('Method not implemented.');
  }
  override set filterModel(val: VisitFilter) {
    throw new Error('Method not implemented.');
  }
  override get service(): VisitService {
    throw new Error('Method not implemented.');
  }
  override initListComponent(): void {
    throw new Error('Method not implemented.');
  }
  protected override getBreadcrumbKeys(): {
    labelKey: string;
    icon?: string;
    routerLink?: string;
  }[] {
    throw new Error('Method not implemented.');
  }
  protected override mapModelToExcelRow(model: Visit): { [key: string]: any } {
    throw new Error('Method not implemented.');
  }
  date2: Date | undefined;
  nationalities!: any[];
  items: MenuItem[] | undefined;
  dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  dialogSize2 = {
    width: '100%',
    maxWidth: '1024px',
  };

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
