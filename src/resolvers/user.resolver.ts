import { User } from '@/models/auth/user';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { UserService } from '@/services/features/user.service';
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { switchMap, tap } from 'rxjs';

export const userResolver: ResolveFn<PaginatedList<User>> = () => {
  const userService = inject(UserService);
  const list = userService
    .loadPaginated(new PaginationParams())
    .pipe(tap((list) => console.log(list)));

  return list;
};
