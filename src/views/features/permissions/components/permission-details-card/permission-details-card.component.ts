import { PERMISSION_STATUS_ENUM } from '@/enums/permission-status-enum';
import { Permission } from '@/models/features/lookups/permission/permission';
import { Attachment } from '@/models/shared/attachment/attachment';
import { AttachmentListComponent } from '@/views/shared/attachment-list/attachment-list.component';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-permission-details-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe, AttachmentListComponent],
  templateUrl: './permission-details-card.component.html',
})
export class PermissionDetailsCardComponent {
  @Input({ required: true }) model!: Permission;
  /** The download URL belongs to the host's route, so the request is passed in. */
  @Input({ required: true }) downloadAttachment!: (attachment: Attachment) => Observable<Blob>;

  permissionStatusEnum = PERMISSION_STATUS_ENUM;
}
