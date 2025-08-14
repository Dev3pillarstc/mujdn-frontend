import { PresenceInquiry } from '@/models/features/presence-inquiry/presence-inquiry';
import { convertUtcToSystemTimeZone } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

export class PresenceInquiryInterceptor implements ModelInterceptorContract<PresenceInquiry> {
  receive(model: PresenceInquiry): PresenceInquiry {
    // Convert AssignedDate from string to Date object

    model.assignedDate = model.assignedDate
      ? convertUtcToSystemTimeZone(model.assignedDate as string)
      : null;

    return model;
  }

  send(model: Partial<PresenceInquiry>): Partial<PresenceInquiry> {
    return model;
  }
}
