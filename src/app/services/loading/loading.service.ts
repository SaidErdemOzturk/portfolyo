import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this.loadingSubject.asObservable();

  show() {
    console.log("girdi")
    this.loadingSubject.next(true)
    console.log(this.loading$)
  }

  hide() {
    this.loadingSubject.next(false);
    console.log("çıktı")
    console.log(this.loading$)
  }
}
