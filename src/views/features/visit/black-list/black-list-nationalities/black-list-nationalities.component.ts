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
@Component({
  selector: 'app-black-list-nationalities',
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
  templateUrl: './black-list-nationalities.component.html',
  styleUrl: './black-list-nationalities.component.scss',
})
export class BlackListNationalitiesComponent {
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
        nationalityAr: 'الجنسية ',
        nationalityEn: 'nationality',
      },
    ];
  }

  openDialog(model?: any) {
    let dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      model: model,
    };
    dialogConfig.width = this.dialogSize.width;
    dialogConfig.maxWidth = this.dialogSize.maxWidth;
    const dialogRef = this.matDialog.open(BlackListNationalityPopupComponent as any, dialogConfig);

    return dialogRef.afterClosed().subscribe((result: DIALOG_ENUM) => {
      console.log('closed');
    });
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
