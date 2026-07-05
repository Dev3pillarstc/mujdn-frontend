import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-system',
  imports: [],
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
