import { PaginationInfo } from '@/models/shared/response/pagination-info';

export class PaginatedList<T> {
  declare list: T[];
  declare paginationInfo: PaginationInfo;
}
