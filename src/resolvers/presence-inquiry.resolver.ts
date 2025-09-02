import { PresenceInquiry } from '@/models/features/presence-inquiry/presence-inquiry';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PresenceInquiryService } from '@/services/features/presence-inquiry.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of } from 'rxjs';

export const presenceInquiryResolver: ResolveFn<PaginatedList<PresenceInquiry> | null> = () => {
  const presenceInquiryService = inject(PresenceInquiryService);
  return presenceInquiryService.loadMyPresenceInquiriesPaginated(new PaginationParams()).pipe(
    catchError(() => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
