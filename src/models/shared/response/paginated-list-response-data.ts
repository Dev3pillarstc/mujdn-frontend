import { ResponseData } from '@/models/shared/response/response-data';
import { PaginatedList } from '@/models/shared/response/paginated-list';

export class PaginatedListResponseData<T> extends ResponseData<PaginatedList<T>> {}
