import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sent-link',
  imports: [TranslatePipe],
  templateUrl: './sent-link.component.html',
  styleUrl: './sent-link.component.scss',
})
export default class SentLinkComponent {}
