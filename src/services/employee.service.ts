import { Injectable } from '@angular/core';
import {BaseCrudService} from '@/abstracts/base-crud-service';
import {Employee} from '@/models/employee';
import {CastResponseContainer} from "cast-response";

@CastResponseContainer({
  $default: {
    model: () => Employee
  }
})
@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseCrudService<Employee> {
  override serviceName: string = 'EmployeeService';

  override getUrlSegment(): string {
    return this.urlService.URLS.EMPLOYEES;
  }
}
