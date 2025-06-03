import { InputTextModule } from 'primeng/inputtext';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent implements OnInit {
  ngOnInit() {

  }
}
