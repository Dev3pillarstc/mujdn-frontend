import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { Component, inject, OnInit } from '@angular/core';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { AddShiftPopupComponent } from '../add-shift-popup/add-shift-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-assign-shift-popup',
  imports: [PaginatorModule, TableModule],
  templateUrl: './assign-shift-popup.component.html',
  styleUrl: './assign-shift-popup.component.scss',
})
export class AssignShiftPopupComponent extends BasePopupComponent implements OnInit {
  first: number = 0;
  rows: number = 10;
  employees!: any[];
  matDialog = inject(MatDialog);
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
}
