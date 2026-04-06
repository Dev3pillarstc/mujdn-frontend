import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { WorkMissionInterceptor } from '@/model-interceptors/features/business/work-mission.interceptor';
import { WorkMissionService } from '@/services/features/business/work-mission.service';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { BaseLookupModel } from '../lookups/base-lookup-model';
import { WorkMissionTypesEnum } from '@/enums/work-mission-type-enum';

const { send, receive } = new WorkMissionInterceptor();

@InterceptModel(new WorkMissionInterceptor())
export class WorkMission extends BaseCrudModel<WorkMission, WorkMissionService> {
  override $$__service_name__$$: string = 'WorkMissionService';
  declare nameEn: string;
  declare nameAr: string;
  declare startDate: Date | string;
  declare endDate: Date | string;
  declare description: string;
  declare missionCreator?: BaseLookupModel;
  declare assignedEmployees?: BaseLookupModel[];
  declare concurrencyUpdateVersion?: Uint8Array;
  declare isMissionCreator: boolean;
  declare isMyMission: boolean;
  workMissionType: WorkMissionTypesEnum = WorkMissionTypesEnum.FullDay;

  buildForm() {
    const { nameAr, nameEn, startDate, endDate, description, workMissionType } = this;
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
      workMissionType: [workMissionType ?? WorkMissionTypesEnum.FullDay, [Validators.required]],
    };
  }
}
