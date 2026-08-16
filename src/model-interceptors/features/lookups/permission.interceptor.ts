import { Permission } from '@/models/features/lookups/permission/permission';
import { toAttachments } from '@/models/shared/attachment/attachment';
import { toDateTime, toDateOnly } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

/**
 * The exact body `POST /api/Permissions` accepts. It rejects any property it does not know,
 * so the create payload is built from scratch instead of being stripped down from the model.
 */
interface CreatePermissionRequestPayload {
  permissionDate: string;
  fkReasonId: number;
  fkPermissionTypeId: number;
  description: string;
  temporaryUploadIds: string[];
}

export class PermissionInterceptor implements ModelInterceptorContract<Permission> {
  receive(model: Permission): Permission {
    model.permissionDate = toDateTime(model.permissionDate);
    model.actionDate = model.actionDate ? toDateTime(model.actionDate) : null;
    model.attachments = toAttachments(model.attachments);

    return model;
  }

  send(model: Partial<Permission>): Partial<Permission> {
    if (!model.id) {
      const payload: CreatePermissionRequestPayload = {
        permissionDate: toDateOnly(model.permissionDate),
        fkReasonId: model.fkReasonId!,
        fkPermissionTypeId: model.fkPermissionTypeId!,
        description: model.description!,
        // Deduped: the API rejects a list that names the same upload twice.
        temporaryUploadIds: [...new Set((model.temporaryUploads ?? []).map((upload) => upload.id))],
      };
      return payload as unknown as Partial<Permission>;
    }

    delete model.permissionReason;
    delete model.permissionType;
    delete model.status;
    delete model.department;
    delete model.creationUser;
    // Stored attachments are read-only and staged uploads are linked at creation only, so
    // neither has any meaning in an update body.
    delete model.attachments;
    delete model.temporaryUploads;
    delete (model as any)['languageService'];
    model.permissionDate = toDateOnly(model.permissionDate);
    return model;
  }
}
