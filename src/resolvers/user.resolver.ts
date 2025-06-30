import { User } from '@/models/auth/user';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { UserService } from '@/services/features/user.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';

export const userResolver: ResolveFn<PaginatedList<User> | null> = () => {
  const userService = inject(UserService);
  return userService.loadPaginated(new PaginationParams()).pipe(
    catchError((error) => {
      return of(null); // Prevent throwing to allow route activation
    })
  );
};
