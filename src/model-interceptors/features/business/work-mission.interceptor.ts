import { WorkMission } from "@/models/features/business/work-mission";
import { toDateOnly, toDateTime } from "@/utils/general-helper";
import { ModelInterceptorContract } from "cast-response";

export class WorkMissionInterceptor implements ModelInterceptorContract<WorkMission> {
    receive(model: WorkMission): WorkMission {
        model.endDate = toDateTime(model.endDate);
        model.startDate = toDateTime(model.startDate);
        return model;
    }
    send(model: Partial<WorkMission>): Partial<WorkMission> {
        model.endDate = toDateOnly(model.endDate);
        model.startDate = toDateOnly(model.startDate);
        return model;
    }
}
