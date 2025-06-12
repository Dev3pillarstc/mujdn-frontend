import { BaseCrudServiceContract } from '@/contracts/base-crud-service-contract';
import { OptionsContract } from '@/contracts/options-contract';
import { map, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UrlService } from '@/services/url.service';
import { CastResponse, HasInterception, InterceptParam } from 'cast-response';
import { ServiceContract } from '@/contracts/service-contract';
import { RegisterServiceMixin } from '@/mixins/register-service-mixin';
import { ListResponseData } from '@/models/shared/response/list-response-data';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';

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
      })
      .pipe(map((response) => response.data as Model[]));
  }

  @CastResponse()
  loadPaginatedSP(options?: OptionsContract | undefined): Observable<PaginatedList<Model>> {
    return this.http
      .get<PaginatedListResponseData<Model>>(this.getUrlSegment() + '/GetWithPagingSP', {
        params: new HttpParams({
          fromObject: options as never,
        }),
      })
      .pipe(
        map((response) => {
          return {
            list: response.data.list as Model[],
            paginationInfo: response.data.paginationInfo,
          };
        })
      );
  }

  @CastResponse()
  loadPaginated(options?: OptionsContract | undefined): Observable<PaginatedList<Model>> {
    return this.http
      .get<PaginatedListResponseData<Model>>(this.getUrlSegment() + '/GetWithPaging', {
        params: new HttpParams({
          fromObject: options as never,
        }),
      })
      .pipe(
        map((response) => {
          return {
            list: response.data.list as Model[],
            paginationInfo: response.data.paginationInfo,
          };
        })
      );
  }

  @CastResponse()
  @HasInterception
  create(@InterceptParam() model: Model): Observable<Model> {
    return this.http.post<Model>(this.getUrlSegment(), model);
  }

  @CastResponse()
  @HasInterception
  update(@InterceptParam() model: Model): Observable<Model> {
    return this.http.put<Model>(this.getUrlSegment(), model);
  }

  @CastResponse()
  delete(id: PrimaryKey): Observable<Model> {
    return this.http.delete<Model>(this.getUrlSegment() + '/' + id);
  }

  @CastResponse()
  getById(id: PrimaryKey): Observable<Model> {
    return this.http.get<Model>(this.getUrlSegment() + '/' + id);
  }
}
