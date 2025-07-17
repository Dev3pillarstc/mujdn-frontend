import UserWorkShift from "@/models/features/lookups/work-shifts/user-work-shifts";
import { toDateOnly } from "@/utils/general-helper";
import { ModelInterceptorContract } from "cast-response";

export class UserWorkShiftInterceptor implements ModelInterceptorContract<UserWorkShift> {
    send(model: Partial<UserWorkShift>): Partial<UserWorkShift> {
        delete model['$$__service_name__$$'];
        delete model['employeeNameAr'];
        delete model['employeeNameEn'];
        model['startDate'] = toDateOnly(model['startDate']);
        model['endDate'] = toDateOnly(model['endDate']);
        return model;
    }
    receive(model: UserWorkShift): UserWorkShift {

        return model;
    }
}