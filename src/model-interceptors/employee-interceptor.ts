import {ModelInterceptorContract} from 'cast-response';
import {Employee} from '@/models/employee';

export class EmployeeInterceptor implements ModelInterceptorContract<Employee> {
    send(model: Partial<Employee>): Partial<Employee> {
        return model;
    }

    receive(model: Employee): Employee {
        model.hiringDate = EmployeeInterceptor.convertIsoDateToEnLocalDateTime(model.hiringDate);
        return model;
    }

    static convertIsoDateToEnLocalDateTime(stringDate: string) {
        const date: Date = new Date(stringDate);

        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
}
