import { PERMISSION_STATUS_ENUM } from '@/enums/permission-status-enum';
import { Permission } from '@/models/features/lookups/permission/permission';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-permission-details-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './permission-details-card.component.html',
})
export class PermissionDetailsCardComponent {
  @Input({ required: true }) model!: Permission;

  permissionStatusEnum = PERMISSION_STATUS_ENUM;
}
