import {InputTextModule} from 'primeng/inputtext';
import {Component, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    imports: [InputTextModule, TranslatePipe],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export default class LoginComponent implements OnInit {
    ngOnInit() {

    }
}
