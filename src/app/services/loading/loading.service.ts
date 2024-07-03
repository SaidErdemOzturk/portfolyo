import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService implements OnInit{

  isloading:boolean=true
  methodsCount:number

  constructor() { }


  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  setLoadingMethod(){
    console.log("loading")
    this.methodsCount+=1
  }

  setCompleteedMethod(){
    console.log("complete")
    this.methodsCount-=1
  }

  isLoading(){
    return this.methodsCount==0?false:true
  }
}
