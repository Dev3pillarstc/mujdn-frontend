import { Department } from "@/models/features/lookups/Department/department";
import { ModelInterceptorContract } from "cast-response";

export class DepartmentInterceptor implements ModelInterceptorContract<Department> {
  send(model: any): any {
    delete model.regionNameEn
    delete model.regionNameAr
    delete model.cityNameEn
    delete model.cityNameAr
    delete model.managerNameEn
    delete model.managerNameAr
    return model;
  }
  receive(model: any): any {
    return model;
  }
}