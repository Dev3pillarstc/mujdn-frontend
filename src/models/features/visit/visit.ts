import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { VisitInterceptor } from '@/model-interceptors/features/visit/visit.interceptor';
import { VisitService } from '@/services/features/visit/visit.service';
import { BaseLookupModel } from '../lookups/base-lookup-model';

const { send, receive } = new VisitInterceptor();

@InterceptModel({ send, receive })
export class Visit extends BaseCrudModel<Visit, VisitService> {
  override $$__service_name__$$: string = 'VisitService';
  declare id: number;
  declare nationalId: string;
  declare nationalIdExpiryDate: string;
  declare fullName: string;
  declare fkNationalityId: number;
  declare visitorOrganization: string;
  declare fkTargetDepartmentId: number;
  declare targetDepartment: BaseLookupModel;
  declare phoneNumber: string;
  declare address: string;
  declare email: string;
  declare visitDate: string;
  declare visitTimeFrom: string;
  declare visitTimeTo: string;
  declare visitPurpose: string;
  declare visitStatus: number;
  declare isEditable: boolean;
  declare creationUser: BaseLookupModel;

  constructor() {
    super();
  }

  buildForm() {
    const {
      nationalId,
      nationalIdExpiryDate,
      fullName,
      fkNationalityId,
      visitorOrganization,
      fkTargetDepartmentId,
      phoneNumber,
      address,
      email,
      visitDate,
      visitTimeFrom,
      visitTimeTo,
      visitPurpose,
    } = this;
    return {
      nationalId: [nationalId, [Validators.required]],
      nationalIdExpiryDate: [nationalIdExpiryDate, [Validators.required]],
      fullName: [fullName, [Validators.required]],
      fkNationalityId: [fkNationalityId, [Validators.required]],
      visitorOrganization: [visitorOrganization, [Validators.required]],
      fkTargetDepartmentId: [fkTargetDepartmentId, [Validators.required]],
      phoneNumber: [phoneNumber, [Validators.required]],
      address: [address, [Validators.required]],
      email: [email, [Validators.required]],
      visitDate: [visitDate, [Validators.required]],
      visitTimeFrom: [visitTimeFrom, [Validators.required]],
      visitTimeTo: [visitTimeTo, [Validators.required]],
      visitPurpose: [visitPurpose, [Validators.required]],
    };
  }
}
