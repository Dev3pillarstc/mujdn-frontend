import { MenuItem } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BlackListNationalityPopupComponent } from '../black-list-nationality-popup/black-list-nationality-popup.component';
import { DIALOG_ENUM } from '@/enums/dialog-enum';
import { BlackListNationalityIdsPopupComponent } from '../black-list-nationality-ids-popup/black-list-nationality-ids-popup.component';
@Component({
  selector: 'app-black-list-national-ids',
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
  ],
  templateUrl: './black-list-national-ids.component.html',
  styleUrl: './black-list-national-ids.component.scss',
})
export class BlackListNationalIdsComponent {
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
  matDialog = inject(MatDialog);

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'معايير حظر الزائرين' }];
    // Updated dummy data to match your Arabic table structure
    this.nationalities = [
      {
        id: '123456789',
      },
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
    const dialogRef = this.matDialog.open(
      BlackListNationalityIdsPopupComponent as any,
      dialogConfig
    );

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      console.log('closed');
    });
  }
}
