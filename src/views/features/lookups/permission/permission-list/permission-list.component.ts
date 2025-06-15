import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { PermissionPopupComponent } from '../permission-popup/permission-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-permission-list',
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule],
  templateUrl: './permission-list.component.html',
  styleUrl: './permission-list.component.scss',
})
export default class PermissionListComponent implements OnInit {
  dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  dialog = inject(MatDialog);
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  date2: Date | undefined;
  permissions!: any[];
  first: number = 0;
  rows: number = 10;

  openDialog(): void {
    const dialogRef = this.dialog.open(PermissionPopupComponent as any, this.dialogSize);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'إعدادات الأذونات' }];
    // Updated dummy data to match your Arabic table structure
    this.permissions = [
      {
        id: 1,
        reasonAr: 'يوجد مشكلة ما و لظرف طارئ',
        reasonEn: 'threre are issue',
      },
      {
        id: 2,
        reasonAr: 'يوجد مشكلة ما و لظرف طارئ',
        reasonEn: 'threre are issue',
      },
    ];
  }

  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
