import { InputTextModule } from 'primeng/inputtext';
import {Component, inject, OnInit} from '@angular/core';
import { LocalStorageService } from '@/services/shared/local-storage.service';
import { LOCALSTORAGE_ENUM } from '@/enums/local-storage-enum';
import { AuthService } from '@/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [InputTextModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent implements OnInit {
  localStorageService = inject(LocalStorageService);
  authService = inject(AuthService);
  ngOnInit() {
  }

  login() {
    this.authService.login('', '').subscribe();
  }
}
