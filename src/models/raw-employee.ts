import {BaseCrudModel} from '@/abstracts/base-crud-model';
import {RawEmployeeService} from '@/services/raw-employee.service';

export class RawEmployee extends BaseCrudModel<RawEmployee, RawEmployeeService> {
  override $$__service_name__$$: string = 'RawEmployeeService';

  declare firstName: string;
  declare lastName: string;
  declare hiringDate: string;

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
