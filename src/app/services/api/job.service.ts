import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Job } from 'src/app/models/job';
import { ListResponseModel } from 'src/app/models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private httpClient:HttpClient) { }

  //apiUrl="http://localhost:5019/api/Job/"
  apiUrl="https://api.saiderdemozturk.com/api/Job/"
  

  getJobs():Observable<ListResponseModel<Job>>{
    return this.httpClient.get<ListResponseModel<Job>>(this.apiUrl+"getjobwithdescriptiondto")
  }
}
