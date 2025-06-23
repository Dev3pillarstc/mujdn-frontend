import { Department } from '@/models/features/lookups/Department/department';
import { ModelInterceptorContract } from 'cast-response';

export class DepartmentInterceptor implements ModelInterceptorContract<Department> {
  send(model: any): any {
    return model;
  }
  receive(model: any): any {
    return model;
  }
}
