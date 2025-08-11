import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { SplitButton } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ViewMissionDataPopupComponent } from '../popups/view-mission-data-popup/view-mission-data-popup.component';
interface Adminstration {
  type: string;
}
@Component({
  selector: 'app-my-missions-tab',
  imports: [
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    DatePickerModule,
    TabsModule,
    FormsModule,
    TranslatePipe,
    Select
  ],
  templateUrl: './my-missions-tab.component.html',
  styleUrl: './my-missions-tab.component.scss'
})
export class MyMissionsTabComponent {

  adminstrations: Adminstration[] | undefined;
  first: number = 0;
  rows: number = 10;
  matDialog = inject(MatDialog);
  missions!: any[];
  date2: Date | undefined;
  selectedAdminstration: Adminstration | undefined;
  ngOnInit() {
    this.adminstrations = [{ type: 'عام' }, { type: 'خاص' }];
    this.missions = [
      {
        taskName: 'حراسة البوابات',
        startDate: '12/12/2024',
        endDate: '18/12/2024',
        taskPredicate: 'محمود أيمن',

        actions: ['view'],
      },
      {
        taskName: 'حراسة البوابات',
        startDate: '12/12/2023',
        endDate: '18/12/2023',
        taskPredicate: 'محمود أيمن',
        actions: ['view'],
      },
      {
        taskName: 'حراسة البوابات',
        startDate: '12/12/2025',
        endDate: '18/12/2025',
        taskPredicate: 'محمود أيمن',

        actions: ['delete', 'edit', 'view'],
      },
      {
        taskName: 'حراسة البوابات',
        startDate: '12/12/2024',
        endDate: '18/12/2024',
        taskPredicate: 'محمود أيمن',

        actions: ['view'],
      },
    ];
  }

  viewMission() {
    const dialogRef = this.matDialog.open(ViewMissionDataPopupComponent, {
      width: '100%',
      maxWidth: '1024px',
    });

    dialogRef.afterClosed().subscribe();
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
