import {ResponseData} from '@/models/response-data';
import {PaginatedList} from '@/models/paginated-list';

export class PaginatedListResponseData<T> extends ResponseData<PaginatedList<T>> {
}
