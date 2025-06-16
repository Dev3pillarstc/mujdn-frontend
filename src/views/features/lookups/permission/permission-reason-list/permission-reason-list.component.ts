import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { BaseListComponent } from '@/abstracts/base-components/base-list/base-list.component';
import { PermissionReasonPopupComponent } from '../permission-reason-popup/permission-reason-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { PermissionReason } from '@/models/features/lookups/permission-reason/permission-reason';
import { PermissionReasonFilter } from '@/models/features/lookups/permission-reason/permission-reason-filter';
import { PermissionReasonService } from '@/services/features/lookups/permission-reason.service';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-permission-list',
  imports: [Breadcrumb, TableModule, PaginatorModule, InputTextModule, FormsModule, TranslatePipe],
  templateUrl: './permission-reason-list.component.html',
  styleUrl: './permission-reason-list.component.scss',
})
export default class PermissionReasonListComponent
  extends BaseListComponent<    PermissionReason,
      PermissionReasonPopupComponent,
      PermissionReasonService,
      PermissionReasonFilter>
  implements OnInit
{
  override dialogSize = {
    width: '100%',
    maxWidth: '600px',
  };
  permissionReasonService = inject(PermissionReasonService);
  home: MenuItem | undefined;
  filterModel: PermissionReasonFilter = new PermissionReasonFilter();

  override get service() {
    return this.permissionReasonService;
  }

  override openDialog(): void {
    this.openBaseDialog(PermissionReasonPopupComponent as any);
  }
}