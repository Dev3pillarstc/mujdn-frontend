import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../core-layout/footer/footer.component';
import { HeaderComponent } from '../../core-layout/header/header.component';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export default class AuthLayoutComponent {}
