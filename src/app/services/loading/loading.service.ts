import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this.loadingSubject.asObservable();
  private loadingCount=0

  show() {
    console.log("girdi")
    this.loadingCount+=1
    this.loadingSubject.next(true)
    console.log(this.loading$)
  }

  hide() {
    this.loadingCount-=1
    if(this.loadingCount==0){
      this.loadingSubject.next(false);
    }
    console.log("çıktı")
    console.log(this.loading$)
  }
}
