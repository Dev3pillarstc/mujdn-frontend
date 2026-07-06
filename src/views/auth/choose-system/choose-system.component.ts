import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-choose-system',
  imports: [TranslatePipe],
  templateUrl: './choose-system.component.html',
  styleUrl: './choose-system.component.scss',
})
export default class ChooseSystemComponent {
  private router = inject(Router);

  goToAttendance() {
    this.router.navigate(['attendance/home']);
  }

  goToVisits() {
    this.router.navigate(['visits/home']);
  }
}
