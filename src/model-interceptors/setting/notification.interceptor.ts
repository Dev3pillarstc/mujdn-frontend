import { Notification } from '@/models/features/setting/notification';
import { convertUtcToSystemTimeZone } from '@/utils/general-helper';
import { ModelInterceptorContract } from 'cast-response';

export class NotificationInterceptor implements ModelInterceptorContract<Notification> {
  receive(model: Notification): Notification {
    // Here you can modify the model after receiving it from the server
    model.creationDate = convertUtcToSystemTimeZone(model.creationDate as string);

    return model;
  }

  send(model: Partial<Notification>): Partial<Notification> {
    delete (model as any).languageService;
    return model;
  }
}
