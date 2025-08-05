import { Notification } from '@/models/features/setting/notification';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { NotificationService } from '@/services/features/setting/notification.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';

export const notificationResolver: ResolveFn<PaginatedList<Notification> | null> = () => {
  const notificationService = inject(NotificationService);
  return notificationService.loadPaginated(new PaginationParams()).pipe(
    catchError((error) => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
