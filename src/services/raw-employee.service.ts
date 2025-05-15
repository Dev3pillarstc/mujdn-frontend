import { Injectable } from '@angular/core';
import {BaseCrudService} from '@/abstracts/base-crud-service';
import {RawEmployee} from '@/models/raw-employee';

@Injectable({
  providedIn: 'root'
})
export class RawEmployeeService extends BaseCrudService<RawEmployee>{
    override serviceName: string = 'RawEmployeeService';
    override getUrlSegment(): string {
        return this.urlService.URLS.EMPLOYEES;
    }

}
