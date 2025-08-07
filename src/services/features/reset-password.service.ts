import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { BaseCrudService } from '@/abstracts/base-crud-service';
import { LookupBaseService } from '@/abstracts/lookup-base.service';
import { UpdateRolesModel } from '@/models/auth/update-roles-model';
import { User } from '@/models/auth/user';
import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { ResponseData } from '@/models/shared/response/response-data';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { of, switchMap, Observable } from 'rxjs';
import { UrlService } from '../url.service';
import { PasswordResetRequestModel } from '@/models/features/password-reset/password-reset-request-model';
import { NewPasswordModel } from '@/models/features/password-reset/new-password-model';
import { PasswordResetResult } from '@/models/features/password-reset/password-reset-result';

@Injectable({
  providedIn: 'root',
})
@CastResponseContainer({
  $default: {
    model: () => PasswordResetRequestModel,
  },
})
export class ResetPasswordService {
  http = inject(HttpClient);
  urlService = inject(UrlService);

  getUrlSegment(): string {
    return this.urlService.URLS.RESET_PASSWORD;
  }

  requestResetPassword(data: PasswordResetRequestModel) {
    return this.http
      .post<ResponseData<PasswordResetResult>>(`${this.getUrlSegment()}/request`, data, {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ResponseData<PasswordResetResult>) => {
          return of(response.data);
        })
      );
  }

  updatePassword(data: NewPasswordModel) {
    return this.http
      .post<ResponseData<PasswordResetResult>>(`${this.getUrlSegment()}/reset`, data, {
        withCredentials: true,
      })
      .pipe(
        switchMap((response: ResponseData<PasswordResetResult>) => {
          return of(response.data);
        })
      );
  }

  verifyResetPassword(userId: string, token: string) {
    return this.http
      .get<ResponseData<PasswordResetResult>>(
        `${this.getUrlSegment()}/verify?userId=${userId}&token=${token}`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        switchMap((response: ResponseData<PasswordResetResult>) => {
          return of(response.data);
        })
      );
  }
}
