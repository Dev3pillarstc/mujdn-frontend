import {InputTextModule} from 'primeng/inputtext';
import {Component} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import { AuthService } from '@/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [InputTextModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {
}
