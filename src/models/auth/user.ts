import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { AuthService } from '@/services/auth/auth.service';

export class User extends BaseCrudModel<User, AuthService, string> {
  override $$__service_name__$$: string = 'AuthService';
  declare email?: string;
  declare identificationNumber?: number;
  declare version?: string;
  declare isActive?: string;
  declare fullNameAr?: string;
  declare fullNameEn?: string;
  declare profilePhotoId?: string;
}
