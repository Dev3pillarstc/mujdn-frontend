import { Permission } from '@/models/features/lookups/permission/permission';
import { toAttachments } from '@/models/shared/attachment/attachment';
import {
  keptAttachmentIds,
  temporaryUploadIds,
  toAttachmentSelection,
} from '@/models/shared/attachment/attachment-selection';
import { toDateTime, toDateOnly } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

/**
 * The exact body `POST /api/Permissions` accepts. It rejects any property it does not know,
 * so the payload is built from scratch instead of being stripped down from the model.
 */
interface CreatePermissionRequestPayload {
  permissionDate: string;
  fkReasonId: number;
  fkPermissionTypeId: number;
  description: string;
  temporaryUploadIds: string[];
}

/** The exact body `PUT /api/Permissions` accepts — the create fields plus row identity. */
interface UpdatePermissionRequestPayload extends CreatePermissionRequestPayload {
  id: number;
  concurrencyUpdateVersion?: string | null;
  keptAttachmentIds: number[];
}

export class PermissionInterceptor implements ModelInterceptorContract<Permission> {
  receive(model: Permission): Permission {
    model.permissionDate = toDateTime(model.permissionDate);
    model.actionDate = model.actionDate ? toDateTime(model.actionDate) : null;
    model.attachments = toAttachments(model.attachments);

    return model;
  }

  send(model: Partial<Permission>): Partial<Permission> {
    // An update that never opened the attachment editor keeps what the permission already
    // has: the keep-list is authoritative, so defaulting to `[]` would wipe every file.
    const selection = model.attachmentSelection ?? toAttachmentSelection(model.attachments);
    const payload: CreatePermissionRequestPayload = {
      permissionDate: toDateOnly(model.permissionDate),
      fkReasonId: model.fkReasonId!,
      fkPermissionTypeId: model.fkPermissionTypeId!,
      description: model.description!,
      // Always present; `[]` when the user staged nothing.
      temporaryUploadIds: temporaryUploadIds(selection),
    };

    if (!model.id) {
      return payload as unknown as Partial<Permission>;
    }

    const updatePayload: UpdatePermissionRequestPayload = {
      ...payload,
      id: model.id,
      // Echoed back exactly as received — reformatting it triggers a false conflict.
      concurrencyUpdateVersion: model.concurrencyUpdateVersion,
      // A keep-list, not a delete-list: every stored attachment whose id is missing here is
      // removed. It is required and must always be sent explicitly — omitting it, or sending
      // `[]` by accident, deletes every file the permission has.
      keptAttachmentIds: keptAttachmentIds(selection),
    };

    return updatePayload as unknown as Partial<Permission>;
  }
}
