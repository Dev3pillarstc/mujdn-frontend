import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { WorkMissionInterceptor } from '@/model-interceptors/features/business/work-mission.interceptor';
import { WorkMissionService } from '@/services/features/business/work-mission.service';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { BaseLookupModel } from '../lookups/base-lookup-model';

const { send, receive } = new WorkMissionInterceptor();

@InterceptModel({ send, receive })
export class WorkMission extends BaseCrudModel<WorkMission, WorkMissionService> {
  override $$__service_name__$$: string = 'WorkMissionService';
  declare nameEn: string;
  declare nameAr: string;
  declare startDate: Date | string;
  declare endDate: Date | string;
  declare description: string;
  declare missionAssigner?: BaseLookupModel;
  declare assignedEmployees?: BaseLookupModel[];
  declare concurrencyUpdateVersion?: Uint8Array;

  buildForm() {
    const { nameAr, nameEn, startDate, endDate, description } = this;
    return {
      nameAr: [
        nameAr,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.ARABIC_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('AR_NUM'),
        ],
      ],
      nameEn: [
        nameEn,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.ENGLISH_NAME_MAX),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
          CustomValidators.pattern('ENG_NUM'),
        ],
      ],
      startDate: [startDate, [Validators.required]],
      endDate: [endDate, [Validators.required]],
      description: [
        description,
        [
          Validators.required,
          Validators.maxLength(CustomValidators.defaultLengths.NOTES),
          Validators.minLength(CustomValidators.defaultLengths.MIN_LENGTH),
        ],
      ],
    };
  }
}
