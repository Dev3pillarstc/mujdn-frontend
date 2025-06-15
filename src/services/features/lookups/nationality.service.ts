import { BaseCrudService } from '@/abstracts/base-crud-service';
import { Nationality } from '@/models/features/lookups/Nationality';
import { NationalityFilter } from '@/models/features/lookups/Nationality-filter';
import { PaginatedListResponseData } from '@/models/shared/response/paginated-list-response-data';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NationalityService extends BaseCrudService<Nationality> {
  serviceName: string = 'NationalityService';
  override getUrlSegment(): string {
    return this.urlService.URLS.NATIONALITIES;
  }

  getAllNationalities(
    pageNumber: number = 1,
    pageSize: number = 10,
    orderBy: string,
    sortDir: string,
    model: NationalityFilter
  ) {
    return this.http.post<PaginatedListResponseData<Nationality>>(
      this.getUrlSegment() +
        '/GetWithPaging' +
        `?PageNumber=${pageNumber}` +
        `&PageSize=${pageSize}` +
        `&SortDir=${sortDir}` +
        `&OrderBy=${orderBy}`,
      model
    );
  }
}
