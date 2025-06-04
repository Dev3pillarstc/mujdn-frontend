import { SpinnerService } from '@/services/shared/spinner.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  standalone: true,
  imports: [ProgressSpinner],
})
export class SpinnerComponent implements OnInit, OnDestroy {
  isLoading = false;
  private subscription: Subscription = new Subscription();

  constructor(private SpinnerService: SpinnerService) {}

  ngOnInit(): void {
    this.subscription = this.SpinnerService.loading$.subscribe(
      loading => this.isLoading = loading
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}