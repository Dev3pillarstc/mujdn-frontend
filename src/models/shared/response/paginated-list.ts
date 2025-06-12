import { PaginationInfo } from '@/models/shared/response/pagination-info';

export abstract class PaginatedList<T> {
  declare list: T[];
  declare paginationInfo: PaginationInfo;
}
