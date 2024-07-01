import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Profile } from 'src/app/models/profile';
import { SingleResponseModel } from 'src/app/models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private httpClient:HttpClient) { }
  
  apiUrl="https://api.saiderdemozturk.com/api/Profile/"
  //apiUrl="http://localhost:5019/api/Profile/"

  getProfile():Observable<SingleResponseModel<Profile>>{
    return this.httpClient.get<SingleResponseModel<Profile>>(this.apiUrl+"getprofile")
  }
}
