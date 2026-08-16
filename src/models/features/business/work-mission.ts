import { BaseCrudModel } from '@/abstracts/base-crud-model';
import { WorkMissionInterceptor } from '@/model-interceptors/features/business/work-mission.interceptor';
import { WorkMissionService } from '@/services/features/business/work-mission.service';
import { CustomValidators } from '@/validators/custom-validators';
import { Validators } from '@angular/forms';
import { InterceptModel } from 'cast-response';
import { BaseLookupModel } from '../lookups/base-lookup-model';
import { WorkMissionTypesEnum } from '@/enums/work-mission-type-enum';
import { Attachment } from '@/models/shared/attachment/attachment';
import { TemporaryUpload } from '@/models/shared/attachment/temporary-upload';

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
  // Files already stored against this mission; always present on read, never sent back
  attachments: Attachment[] = [];
  // Files staged for a mission that does not exist yet. The API links attachments at
  // creation time only, so this is write-once: the create payload carries their ids and the
  // edit payload never mentions them — which is why the popup drops this control when
  // editing rather than leaving a field that changes nothing.
  temporaryUploads: TemporaryUpload[] = [];

  buildForm() {
    const { nameAr, nameEn, startDate, endDate, description, workMissionType, temporaryUploads } =
      this;
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
      // Attachments are optional on a mission — the API accepts an empty id list.
      temporaryUploads: [temporaryUploads ?? []],
    };
  }
}
