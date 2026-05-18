import { BasePopupComponent } from '@/abstracts/base-components/base-popup/base-popup.component';
import { BaseAppComponent } from '@/views/app/base-app/base-app.component';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { M } from '@angular/material/dialog.d-B5HZULyo';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-report-details-modal',
  imports: [TranslateModule],
  templateUrl: './report-details-modal.component.html',
  styleUrl: './report-details-modal.component.scss',
})
export class ReportDetailsModalComponent extends BaseAppComponent implements OnInit {}
