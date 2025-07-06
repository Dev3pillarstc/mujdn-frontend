import { BaseLookupModel } from '../features/lookups/base-lookup-model';

export class UsersWithDepartmentLookup extends BaseLookupModel {
  declare departmentId?: number;
  declare nationalId?: string;
}
