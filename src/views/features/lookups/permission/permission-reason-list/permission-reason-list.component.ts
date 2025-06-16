import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { PermissionReasonPopupComponent } from '../permission-reason-popup/permission-reason-popup.component';
@Component({
  selector: 'app-permission-list',
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule],
  templateUrl: './permission-reason-list.component.html',
  styleUrl: './permission-reason-list.component.scss',
})
export default class PermissionReasonListComponent
  extends BaseListComponent<PermissionReasonPopupComponent>
  implements OnInit
{
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  override openDialog(): void {
    this.openBaseDialog(PermissionReasonPopupComponent as any);
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
