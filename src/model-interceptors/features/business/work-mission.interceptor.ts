import { WorkMission } from '@/models/features/business/work-mission';
import { toAttachments } from '@/models/shared/attachment/attachment';
import { WorkMissionTypesEnum } from '@/enums/work-mission-type-enum';
import { toDateOnly, toDateTime } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

/**
 * The exact body `POST /api/WorkMission` accepts. It rejects any property it does not know,
 * so the create payload is built from scratch instead of being stripped down from the model.
 */
interface CreateWorkMissionRequestPayload {
  nameAr: string;
  nameEn?: string | null;
  startDate: string;
  endDate: string;
  description: string;
  workMissionType: WorkMissionTypesEnum;
  temporaryUploadIds: string[];
}

export class WorkMissionInterceptor implements ModelInterceptorContract<WorkMission> {
  receive(model: WorkMission): WorkMission {
    model.endDate = toDateTime(model.endDate);
    model.startDate = toDateTime(model.startDate);
    model.attachments = toAttachments(model.attachments);
    return model;
  }
  send(model: Partial<WorkMission>): Partial<WorkMission> {
    if (!model.id) {
      const payload: CreateWorkMissionRequestPayload = {
        nameAr: model.nameAr!,
        nameEn: model.nameEn ?? null,
        startDate: toDateOnly(model.startDate),
        endDate: toDateOnly(model.endDate),
        description: model.description!,
        workMissionType: model.workMissionType!,
        // Deduped: the API rejects a list that names the same upload twice.
        temporaryUploadIds: [...new Set((model.temporaryUploads ?? []).map((upload) => upload.id))],
      };
      return payload as unknown as Partial<WorkMission>;
    }

    // Stored attachments are read-only and staged uploads are linked at creation only, so
    // neither has any meaning in an update body.
    delete model.attachments;
    delete model.temporaryUploads;
    model.endDate = toDateOnly(model.endDate);
    model.startDate = toDateOnly(model.startDate);
    return model;
  }
}
