import { BaseCrudModel } from "@/abstracts/base-crud-model";
import { notificationChannelInterceptor } from "@/model-interceptors/setting/notification-channel.interceptor";
import { NotificationChannelService } from "@/services/features/setting/notification-channel.service";
import { InterceptModel } from "cast-response";

const { send, receive } = new notificationChannelInterceptor();

@InterceptModel({ send, receive })

export class NotificationChannel extends BaseCrudModel<NotificationChannel, NotificationChannelService>{
    override $$__service_name__$$: string = 'NotificationChannelService';

  isSms: boolean = true;
  isMobile: boolean = true;
  isWeb: boolean = true;

  buildForm() {
    const { isSms, isMobile, isWeb } = this;
    const form = {
      isSms: [isSms, []],
      isMobile: [isMobile, []],
      isWeb: [isWeb, []],
    };

    return form;
  }
}
