import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MatDialogModule } from '@angular/material/dialog';
import { NotificationChannel } from '@/models/features/setting/notification-channel';
import { NotificationChannelService } from '@/services/features/setting/notification-channel.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TabsModule } from 'primeng/tabs';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-notification-channels',
  standalone: true,
  imports: [
    MatDialogModule,
    Breadcrumb,
    ReactiveFormsModule,
    TranslatePipe,
    TabsModule,
    RouterModule,
  ],
  templateUrl: './notification-channels.component.html',
  styleUrls: ['./notification-channels.component.scss'],
})
export default class NotificationChannelsComponent implements OnInit, OnDestroy {
  $destroy: Subject<void> = new Subject<void>();
  fb: FormBuilder = inject(FormBuilder);
  service: NotificationChannelService = inject(NotificationChannelService);
  translateService: TranslateService = inject(TranslateService);
  breadcrumbs: MenuItem[] = [
    { label: this.translateService.instant('NOTIFICATION.NOTIFICATION_SETTINGS') },
  ];
  model = new NotificationChannel();
  form!: FormGroup;
  loading = false;
  route = inject(ActivatedRoute);
  home: MenuItem = this.setHomeItem();

  ngOnInit(): void {
    this.model = this.route.snapshot.data['channel'];
    this.form = this.fb.group(this.model.buildForm());
    this.translateService.onLangChange.pipe(takeUntil(this.$destroy)).subscribe(() => {
      this.home = this.setHomeItem();
      this.breadcrumbs = [
        { label: this.translateService.instant('NOTIFICATION.NOTIFICATION_SETTINGS') },
      ];
    });
  }
  setHomeItem(): MenuItem {
    return {
      label: this.translateService.instant('COMMON.HOME'),
      icon: 'pi pi-home',
      routerLink: '/home',
    };
  }
  save(): void {
    this.model = Object.assign(this.model, { ...this.form.value });
    this.service.update(this.model).subscribe({
      next: (result: NotificationChannel) => {
        this.model = Object.assign(new NotificationChannel(), result);
      },
    });
  }
  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
