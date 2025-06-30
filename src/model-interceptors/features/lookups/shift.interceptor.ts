import Shift from "@/models/features/lookups/work-shifts/shift";
import { ModelInterceptorContract } from "cast-response";

export class ShiftInterceptor implements ModelInterceptorContract<Shift> {
    receive(model: Shift): Shift {
        return model;
    }

    send(model: Partial<Shift>): Partial<Shift> {
        return model;
    }
}