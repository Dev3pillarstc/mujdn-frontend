import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { VersionComponent } from '@/components/version/version.component'

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, VersionComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {}
