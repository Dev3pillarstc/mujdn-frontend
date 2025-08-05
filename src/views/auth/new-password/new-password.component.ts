import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TranslatePipe } from '@ngx-translate/core';
import { Password } from 'primeng/password';

@Component({
  selector: 'app-new-password',
  imports: [InputTextModule, TranslatePipe, Password],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss',
})
export default class NewPasswordComponent {}
