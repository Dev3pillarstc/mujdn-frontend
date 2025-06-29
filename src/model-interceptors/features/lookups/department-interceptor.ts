// import { Department } from '@/models/features/lookups/department/department';
import { ModelInterceptorContract } from 'cast-response';
import { Department } from '@/models/features/lookups/department/department';

export class DepartmentInterceptor implements ModelInterceptorContract<Department> {
  send(model: any): any {
    delete model.manager;
    delete model.city;
    delete model.region;
    delete model.childDepartments;
    return model;
  }

  receive(model: any): any {
    delete model.$$__service_name__$$;
    return model;
  }
}
