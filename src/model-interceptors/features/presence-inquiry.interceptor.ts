import { PresenceInquiry } from '@/models/features/presence-inquiry/presence-inquiry';
import { toDateTime, toDateOnly, convertUtcToSystemTimeZone } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

export class PresenceInquiryInterceptor implements ModelInterceptorContract<PresenceInquiry> {
  receive(model: PresenceInquiry): PresenceInquiry {
    // Convert AssignedDate from string to Date object

    model.assignedDate = convertUtcToSystemTimeZone(model.assignedDate as string);

    return model;
  }

  send(model: Partial<PresenceInquiry>): Partial<PresenceInquiry> {
    // Remove client-side only props
    delete model.assignedUsers;

    delete (model as any).languageService;

    return model;
  }
}
