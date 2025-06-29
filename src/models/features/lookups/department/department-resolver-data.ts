import { PaginatedList } from '@/models/shared/response/paginated-list';
import { Department } from './department';

export class DepartmentResolverData {
  declare parentDepartment: Department | null;
  declare childDepartments: PaginatedList<Department>;
}
