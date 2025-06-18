import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MatDialogModule } from '@angular/material/dialog';

import { NotificationChannel } from '@/models/features/setting/notification-channel';
import { NotificationChannelService } from '@/services/features/setting/notification-channel.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notification-channels',
  standalone: true,
  imports: [MatDialogModule, Breadcrumb, ReactiveFormsModule],
  templateUrl: './notification-channels.component.html',
  styleUrls: ['./notification-channels.component.scss'],
})
export default class NotificationChannelsComponent implements OnInit {
  private fb: FormBuilder = inject(FormBuilder);
  private service: NotificationChannelService = inject(NotificationChannelService);

  items: MenuItem[] | undefined;
  model = new NotificationChannel();
  form!: FormGroup;
  loading = false;
  route = inject(ActivatedRoute);
  ngOnInit(): void {
    this.items = [
      { label: 'لوحة المعلومات' },
      { label: 'إعدادات الإشعارات' },
    ];
   this.model = this.route.snapshot.data['channel'];
  this.form = this.fb.group(this.model.buildForm())
  }
  
  loadData(): void {
    this.loading = true;
    this.service.getSingle().subscribe({
      next: (channel : NotificationChannel) => {
        this.model = Object.assign(new NotificationChannel(), channel);
        this.form = this.fb.group(this.model.buildForm());
      },
      complete: () => (this.loading = false),
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const updatedModel = { ...this.model, ...this.form.value };

    this.service.updateSingle(updatedModel).subscribe({
      next: (result : NotificationChannel) => {
        this.model = Object.assign(new NotificationChannel(), result);
      },
    });
  }
}
