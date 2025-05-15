import {Component, inject, OnInit} from '@angular/core';
import {Employee} from '@/models/employee';
import {EmployeeService} from '@/services/employee.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-employees',
  imports: [
    RouterLink
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export default class EmployeesComponent implements OnInit {
  list: Employee[] = [];
  service = inject(EmployeeService);

  ngOnInit(): void {
    this.service.load().subscribe(res => {
      this.list = res;
      console.log('Employees', res);
    });
  }
}
