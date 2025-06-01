import {PaginationInfo} from '@/models/pagination-info';

export abstract class PaginatedList<T> {
  declare list: T[];
  declare paginationInfo: PaginationInfo
}
