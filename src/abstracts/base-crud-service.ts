import { BaseCrudServiceContract } from '@/contracts/base-crud-service-contract';
import { OptionsContract } from '@/contracts/options-contract';
import { catchError, map, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UrlService } from '@/services/url.service';
import { CastResponse, HasInterception, InterceptParam } from 'cast-response';
import { ServiceContract } from '@/contracts/service-contract';
import { RegisterServiceMixin } from '@/mixins/register-service-mixin';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';
import { PaginationParams } from '@/models/shared/pagination-params';
import { genericDateOnlyConvertor } from '@/utils/general-helper';

export abstract class BaseCrudService<Model, PrimaryKey = number>
  extends RegisterServiceMixin(class {})
  implements BaseCrudServiceContract<Model, PrimaryKey>, ServiceContract
{
  abstract serviceName: string;
  protected urlService = inject(UrlService);
  protected http = inject(HttpClient);

  abstract getUrlSegment(): string;

  @CastResponse()
  load(options?: OptionsContract | undefined): Observable<Model[]> {
    return this.http
      .get<ListResponseData<Model>>(this.getUrlSegment(), {
        params: new HttpParams({
          fromObject: options as never,
        }),
        withCredentials: true,
      })
      .pipe(map((response) => response.data as Model[]))
      .pipe(
        catchError((err) => {
          // Let the global ErrorHandler handle it
          throw err;
        })
      );
  }

  @CastResponse(undefined, { fallback: '$pagination' })
  loadPaginatedSP(
    paginationParams?: PaginationParams,
    filterOptions?: OptionsContract | undefined
  ): Observable<PaginatedList<Model>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);
    return this.http
      .post<PaginatedListResponseData<Model>>(
        this.getUrlSegment() + '/GetWithPagingSP',
        filterOptions || {},
        {
          params: httpParams, // <-- query string
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          return {
            list: response.data.list as Model[],
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

  @CastResponse(undefined, { fallback: '$pagination' })
  loadPaginated(
    paginationParams?: PaginationParams,
    filterOptions?: OptionsContract | undefined
  ): Observable<PaginatedList<Model>> {
    const httpParams = new HttpParams({
      fromObject: paginationParams as unknown as never,
    });
    filterOptions = genericDateOnlyConvertor(filterOptions);
    return this.http
      .post<PaginatedListResponseData<Model>>(
        this.getUrlSegment() + '/GetWithPaging',
        filterOptions || {},
        {
          params: httpParams, // <-- query string
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          return {
            list: response.data.list as Model[],
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
  create(@InterceptParam() model: Model): Observable<Model> {
    return this.http.post<Model>(this.getUrlSegment(), model, { withCredentials: true }).pipe(
      catchError((err) => {
        // Let the global ErrorHandler handle it
        throw err;
      })
    );
  }

  @CastResponse()
  @HasInterception
  update(@InterceptParam() model: Model): Observable<Model> {
    return this.http.put<Model>(this.getUrlSegment(), model, { withCredentials: true }).pipe(
      catchError((err) => {
        // Let the global ErrorHandler handle it
        throw err;
      })
    );
  }

  @CastResponse()
  delete(id: PrimaryKey): Observable<Model> {
    return this.http.delete<Model>(this.getUrlSegment() + '/' + id, { withCredentials: true }).pipe(
      catchError((err) => {
        // Let the global ErrorHandler handle it
        throw err;
      })
    );
  }

  @CastResponse()
  getById(id: PrimaryKey): Observable<Model> {
    return this.http.get<Model>(this.getUrlSegment() + '/' + id, { withCredentials: true }).pipe(
      catchError((err) => {
        // Let the global ErrorHandler handle it
        throw err;
      })
    );
  }
}
