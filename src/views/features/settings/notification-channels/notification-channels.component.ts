import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MatDialogModule } from '@angular/material/dialog';
import { NotificationChannel } from '@/models/features/setting/notification-channel';
import { NotificationChannelService } from '@/services/features/setting/notification-channel.service';
import { ActivatedRoute } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-notification-channels',
  standalone: true,
  imports: [MatDialogModule, Breadcrumb, ReactiveFormsModule, TranslatePipe],
  templateUrl: './notification-channels.component.html',
  styleUrls: ['./notification-channels.component.scss'],
})
export default class NotificationChannelsComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  service: NotificationChannelService = inject(NotificationChannelService);
  translateService: TranslateService = inject(TranslateService);
  breadcrumbs: MenuItem[] | undefined;
  model = new NotificationChannel();
  form!: FormGroup;
  loading = false;
  route = inject(ActivatedRoute);
  ngOnInit(): void {
    this.breadcrumbs = [{ label: this.translateService.instant('NOTIFICATION.NOTIFICATION_SETTINGS') }];
    this.model = this.route.snapshot.data['channel'];
    this.form = this.fb.group(this.model.buildForm());
  }

  save(): void {
    this.model = Object.assign(this.model, { ...this.form.value });
    this.service.update(this.model).subscribe({
      next: (result: NotificationChannel) => {
        this.model = Object.assign(new NotificationChannel(), result);
      },
    });
  }
}
