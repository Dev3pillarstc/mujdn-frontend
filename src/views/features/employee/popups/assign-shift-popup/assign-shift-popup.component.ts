import { Component, inject, OnInit } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { AddShiftPopupComponent } from '../add-shift-popup/add-shift-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { LANGUAGE_ENUM } from '@/enums/language-enum';
import { LAYOUT_DIRECTION_ENUM } from '@/enums/layout-direction-enum';
import { LanguageService } from '@/services/shared/language.service';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-assign-shift-popup',
  imports: [PaginatorModule, TableModule],
  templateUrl: './assign-shift-popup.component.html',
  styleUrl: './assign-shift-popup.component.scss',
})
export class AssignShiftPopupComponent implements OnInit {
  first: number = 0;
  rows: number = 10;
  employees!: any[];
  matDialog = inject(MatDialog);
  declare direction: LAYOUT_DIRECTION_ENUM;
  languageService = inject(LanguageService);
  dialogRef = inject(DialogRef);

  addShift() {
    const dialogRef = this.matDialog.open(AddShiftPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this.direction =
      this.languageService.getCurrentLanguage() == LANGUAGE_ENUM.ENGLISH
        ? LAYOUT_DIRECTION_ENUM.LTR
        : LAYOUT_DIRECTION_ENUM.RTL;
    this.employees = [
      {
        shiftName: 'وردية نهارية',
        dateFrom: '2023-04-01',
        dateTo: '2023-04-30',
      },
      {
        shiftName: 'وردية نهارية',
        dateFrom: '2023-04-01',
        dateTo: '2023-04-30',
      },
      {
        shiftName: 'وردية نهارية',
        dateFrom: '2023-04-01',
        dateTo: '2023-04-30',
      },
    ];
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }

  close() {
    this.dialogRef.close();
  }
}
