import { BaseLookupModel } from '../lookups/base-lookup-model';

export class UserProfileDataWithNationalId extends BaseLookupModel {
  nationalId?: string;
  departmentId?: number;
  departmentNameAr?: string;
  departmentNameEn?: string;
}
