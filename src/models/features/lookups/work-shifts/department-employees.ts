import { UsersWithDepartmentLookup } from '@/models/auth/users-department-lookup';
import { BaseLookupModel } from '@/models/features/lookups/base-lookup-model';

export interface DepartmentEmployees {
  department: BaseLookupModel;
  employees: UsersWithDepartmentLookup[];
}
