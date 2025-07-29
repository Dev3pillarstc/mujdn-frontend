import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-new-password',
  imports: [InputTextModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss',
})
export default class NewPasswordComponent {}
