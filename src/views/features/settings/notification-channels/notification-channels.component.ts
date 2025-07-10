import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MatDialogModule } from '@angular/material/dialog';
import { NotificationChannel } from '@/models/features/setting/notification-channel';
import { NotificationChannelService } from '@/services/features/setting/notification-channel.service';
import { ActivatedRoute } from '@angular/router';
import { ResponseData } from '@/models/shared/response/response-data';

@Component({
  selector: 'app-notification-channels',
  standalone: true,
  imports: [MatDialogModule, Breadcrumb, ReactiveFormsModule],
  templateUrl: './notification-channels.component.html',
  styleUrls: ['./notification-channels.component.scss'],
})
export default class NotificationChannelsComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  service: NotificationChannelService = inject(NotificationChannelService);

  items: MenuItem[] | undefined;
  model = new NotificationChannel();
  form!: FormGroup;
  loading = false;
  route = inject(ActivatedRoute);
  ngOnInit(): void {
    this.items = [{ label: 'لوحة المعلومات' }, { label: 'إعدادات الإشعارات' }];
    this.model = this.route.snapshot.data['channel'];
    console.log(this.model);
    this.form = this.fb.group(this.model.buildForm());
  }

  save(): void {
    this.model = Object.assign(this.model, { ...this.form.value });
    console.log(this.model);
    this.service.updateChannel(this.model).subscribe({
      next: (result: ResponseData<NotificationChannel>) => {
        this.model = Object.assign(new NotificationChannel(), result);
      },
    });
  }
}
