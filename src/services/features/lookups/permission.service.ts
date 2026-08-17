import { BaseCrudService } from '@/abstracts/base-crud-service';
import { OptionsContract } from '@/contracts/options-contract';
import { Permission } from '@/models/features/lookups/permission/permission';
import { PaginationParams } from '@/models/shared/pagination-params';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { genericDateOnlyConvertor } from '@/utils/general-helper';
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AttachmentService } from '@/services/shared/attachment.service';
import { CastResponse, CastResponseContainer, HasInterception } from 'cast-response';
import { Observable, map, catchError } from 'rxjs';
import { LANGUAGE_ENUM } from '@/enums/language-enum';

@CastResponseContainer({
  $default: {
    model: () => Permission,
  },
  $pagination: {
    model: () => PaginatedList<Permission>,
    unwrap: 'data',
    shape: { 'list.*': () => Permission },
  },
})
@Injectable({
  providedIn: 'root',
})
export class PermissionService extends BaseCrudService<Permission> {
  serviceName: string = 'PermissionService';
  private attachmentService = inject(AttachmentService);

  override getUrlSegment(): string {
    return this.urlService.URLS.PERMISSIONS;
  }

  /**
   * Streams a stored attachment's bytes. A caller without visibility into the permission
   * gets a 404 rather than a 403 — that is "not accessible", not "missing", and is not
   * worth a retry.
   */
  downloadAttachment(permissionId: number, attachmentId: number): Observable<Blob> {
    return this.attachmentService.downloadContent(
      `${this.getUrlSegment()}/${permissionId}/attachments/${attachmentId}/content`
    );
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  loadDepartmentPermissionPaginated(
    paginationParams?: PaginationParams,
    filterOptions?: OptionsContract | undefined
  ): Observable<PaginatedList<Permission>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);
    return this.http
      .post<PaginatedListResponseData<Permission>>(
        this.getUrlSegment() + '/GetDepartmentPermissionsWithPaging',
        filterOptions || {},
        {
          params: httpParams, // <-- query string
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          return {
            list: response.data.list as Permission[],
            paginationInfo: response.data.paginationInfo,
          };
        })
      )
      .pipe(
        catchError((err) => {
          // Let the global ErrorHandler handle it
          throw err;
        })
      );
  }
  @CastResponse()
  @HasInterception
  acceptPermission(permissionId: number): Observable<Permission> {
    const url = `${this.getUrlSegment()}/${permissionId}/accept`;
    return this.http.put<Permission>(url, null, { withCredentials: true });
  }
  @CastResponse()
  @HasInterception
  rejectPermission(permissionId: number): Observable<Permission> {
    const url = `${this.getUrlSegment()}/${permissionId}/reject`;
    return this.http.put<Permission>(url, null, { withCredentials: true });
  }

  exportDepartmentPermissionsPdf(
    language: LANGUAGE_ENUM | string,
    filterOptions?: OptionsContract
  ): Observable<Blob> {
    return this.exportPdfByEndpoint('ExportDepartmentPermissionsPdf', language, filterOptions);
  }

  exportPermissionPdf(
    language: LANGUAGE_ENUM | string,
    filterOptions?: OptionsContract
  ): Observable<Blob> {
    return this.exportPdfByEndpoint('ExportPermissionPdf', language, filterOptions);
  }
}
