import {BaseCrudModel} from '@/abstracts/base-crud-model';
import {EmployeeService} from '@/services/employee.service';
import {EmployeeInterceptor} from "@/model-interceptors/employee-interceptor";
import {InterceptModel} from "cast-response";

const {send, receive} = new EmployeeInterceptor();

@InterceptModel({send, receive})
export class Employee extends BaseCrudModel<Employee, EmployeeService>{
    override $$__service_name__$$: string = 'EmployeeService';

    declare firstName: string;
    declare lastName: string;
    declare hiringDate: string;

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
