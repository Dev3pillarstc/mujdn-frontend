import { BaseLookupModel } from '../lookups/base-lookup-model';

export class UserProfileDataWithNationalId extends BaseLookupModel {
  nationalId?: string;
  departmentNameAr?: string;
  departmentNameEn?: string;
}
