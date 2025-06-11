import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { FooterComponent } from '../../core-layout/footer/footer.component';
import { HeaderComponent } from '../../core-layout/header/header.component';
import { SideMenuComponent } from "../side-menu/side-menu.component";

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    SideMenuComponent
],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export default class MainLayoutComponent {

}
