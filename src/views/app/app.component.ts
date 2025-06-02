import {Component, inject, OnInit} from '@angular/core'
import {RouterOutlet} from '@angular/router'
import {VersionComponent} from '@/components/version/version.component'
import {AuthService} from '@/services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VersionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit() {
    // this.authService.autoLogin();
  }
}
