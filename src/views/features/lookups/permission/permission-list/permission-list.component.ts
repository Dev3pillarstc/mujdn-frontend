import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { PermissionPopupComponent } from '../permission-popup/permission-popup.component';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
@Component({
  selector: 'app-permission-list',
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule],
  templateUrl: './permission-list.component.html',
  styleUrl: './permission-list.component.scss',
})
export default class PermissionListComponent
  extends BaseListComponent<PermissionPopupComponent>
  implements OnInit
{
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  override openDialog(): void {
    this.openBaseDialog(PermissionPopupComponent as any);
  }
  items: MenuItem[] | undefined;

  home: MenuItem | undefined;

  date2: Date | undefined;
  permissions!: any[];
  first: number = 0;
  rows: number = 10;

  ngOnInit() {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'إعدادات الأذونات' }];
    // Updated dummy data to match your Arabic table structure
    this.permissions = [
      {
        id: 1,
        reason: 'يوجد مشكلة ما و لظرف طارئ',
      },
      {
        id: 2,
        reason: 'يوجد مشكلة ما و لظرف طارئ',
      },
    ];
  }
  onPageChange(event: PaginatorState) {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
  }
}
