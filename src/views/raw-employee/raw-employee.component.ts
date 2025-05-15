import {Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Employee} from '@/models/employee';
import {EmployeeService} from '@/services/employee.service';
import {RawEmployeeService} from '@/services/raw-employee.service';

@Component({
  selector: 'app-raw-employee',
  imports: [
    RouterLink
  ],
  templateUrl: './raw-employee.component.html',
  styleUrl: './raw-employee.component.scss'
})
export default class RawEmployeeComponent implements OnInit {
  list: Employee[] = [];
  service = inject(RawEmployeeService);

  ngOnInit(): void {
    this.service.load().subscribe(res => {
      this.list = res;
      console.log('raw Employees', res);
    });
  }
}
