import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalyticsService } from 'src/app/services/analytics/analytics.service';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  isLoading = true;

  private subscription: Subscription;
  constructor(
    public analyticsService: AnalyticsService,
    private loadingService:LoadingService

  ) { }

  ngOnInit(): void {
    this.subscription = this.loadingService.loading$.subscribe(
      (loading) => {
        this.isLoading = loading;
      }
    );
  }

}
