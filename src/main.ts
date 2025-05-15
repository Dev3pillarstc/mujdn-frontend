import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from '@/configs/app.config'
import { AppComponent } from '@/views/app/app.component'

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err))
