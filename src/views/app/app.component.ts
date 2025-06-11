import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SpinnerComponent} from '../shared/spinner/spinner.component';
import {CommonModule} from '@angular/common';
import {BaseAppComponent} from '@/views/app/base-app/base-app.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SpinnerComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent extends BaseAppComponent implements OnInit {

}
