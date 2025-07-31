import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-not-authorized',
  imports: [TranslatePipe],
  templateUrl: './not-authorized.component.html',
  styleUrl: './not-authorized.component.scss',
})
export default class NotAuthorizedComponent {}
