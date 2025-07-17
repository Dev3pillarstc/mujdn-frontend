import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-notifiactions',
  imports: [
    Breadcrumb,
    InputTextModule,
    TableModule,
    CommonModule,
    RouterModule,
    CommonModule,
    PaginatorModule,
    DatePickerModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './notifiactions.component.html',
  styleUrl: './notifiactions.component.scss',
})
export default class NotifiactionsComponent {
  first: number = 0;
  rows: number = 10;
  date2: Date | undefined;
  notifications!: any[];
  breadcrumbs: MenuItem[] | undefined;
  home: MenuItem | undefined;
  matDialog = inject(MatDialog);

  ngOnInit() {
    this.breadcrumbs = [{ label: 'لوحة المعلومات' }, { label: 'الاشعارات' }];
    // Updated dummy data to match your Arabic table structure
    this.notifications = [
      {
        notificationAddress: 'هنا يكون محتوى الاشعار هنا يكون محتوى الاشعار هنا يكون محتوى الاشعار',
        notificationDate: '12/12/2024',
      },
      {
        notificationAddress: 'هنا يكون محتوى الاشعار هنا يكون محتوى الاشعار هنا يكون محتوى الاشعار',
        notificationDate: '12/12/2024',
      },
      {
        notificationAddress: 'هنا يكون محتوى الاشعار هنا يكون محتوى الاشعار هنا يكون محتوى الاشعار',
        notificationDate: '12/12/2024',
      },
    ];
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
