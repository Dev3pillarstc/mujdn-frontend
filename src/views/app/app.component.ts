import {Component, inject, OnInit} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {VersionComponent} from '@/components/version/version.component'
import {AuthService} from '@/services/auth/auth.service';
import { spinnerService } from '@/services/shared/spinner.service';
import { SpinnerComponent } from "../shared/spinner/spinner.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VersionComponent, SpinnerComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  spinnerService = inject(spinnerService);
  showSpinner = false;
  ngOnInit() {
    this.spinnerService.loading$.subscribe(loading => this.showSpinner = loading);
    // this.authService.autoLogin();
  }
}
