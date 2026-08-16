import { ModelInterceptorContract } from 'cast-response';
import { Leave } from '@/models/features/lookups/leave/leave';
import { toDateOnly, toDateTime } from '@/utils/general-helper';
import { toAttachments } from '@/models/shared/attachment/attachment';

/** The wire shape the leaves API accepts — deliberately narrower than the model. */
interface LeaveRequestPayload {
  fkEmployeeId?: number;
  fkLeaveTypeId?: number;
  dateFrom: string;
  dateTo: string;
  id?: number;
  concurrencyUpdateVersion?: string | null;
  temporaryUploadIds?: string[];
}

export class LeaveInterceptor implements ModelInterceptorContract<Leave> {
  receive(model: Leave): Leave {
    model.dateFrom = toDateTime(model.dateFrom);
    model.dateTo = toDateTime(model.dateTo);
    model.actionDate = toDateTime(model.actionDate);
    model.attachments = toAttachments(model.attachments);
    return model;
  }

  // The leaves API rejects unknown JSON properties (UnmappedMemberHandling.Disallow),
  // so send exactly the request shape and nothing else: create sends the
  // CreateLeaveRequest fields; update additionally needs id + the row-version.
  send(model: Partial<Leave>): Partial<Leave> {
    const payload: LeaveRequestPayload = {
      fkEmployeeId: model.fkEmployeeId,
      fkLeaveTypeId: model.fkLeaveTypeId,
      dateFrom: toDateOnly(model.dateFrom),
      dateTo: toDateOnly(model.dateTo),
    };

    if (model.id) {
      payload.id = model.id;
      payload.concurrencyUpdateVersion = model.concurrencyUpdateVersion;
    } else {
      // Attachments can only be linked while the leave is being created — edit has no
      // attachment support at all. Ids are deduped because the API rejects a list that
      // names the same upload twice.
      payload.temporaryUploadIds = [
        ...new Set((model.temporaryUploads ?? []).map((upload) => upload.id)),
      ];
    }

    return payload as unknown as Partial<Leave>;
  }
}
