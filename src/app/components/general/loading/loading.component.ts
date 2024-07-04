import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  isLoading = true;
  private subscription: Subscription;
  constructor(private loadingService: LoadingService) {

    this.subscription = this.loadingService.loading$.subscribe(
      (loading) => {
        this.isLoading = loading;
        if (!loading) {
          this.scrollToTop();
        }
      }
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  private scrollToTop() {
    document.documentElement.scrollTop = 0;
  }
}
