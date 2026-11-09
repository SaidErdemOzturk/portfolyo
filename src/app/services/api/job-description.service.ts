import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JobDescription } from 'src/app/models/jobDescription';
import { ResponseModel } from 'src/app/models/responseModel';
import { SingleResponseModel } from 'src/app/models/singleResponseModel';

@Injectable({
  providedIn: 'root'
})
export class JobDescriptionService {

  constructor(private httpClient: HttpClient) { }

  apiUrl = "https://api.saiderdemozturk.com/api/JobDescription/";

  add(jobDescription: JobDescription): Observable<SingleResponseModel<JobDescription>> {
    return this.httpClient.post<SingleResponseModel<JobDescription>>(this.apiUrl + "add", jobDescription);
  }

  delete(jobDescription: JobDescription): Observable<ResponseModel> {
    return this.httpClient.post<ResponseModel>(this.apiUrl + "delete", jobDescription);
  }

  update(jobDescription: JobDescription): Observable<SingleResponseModel<JobDescription>> {
    return this.httpClient.post<SingleResponseModel<JobDescription>>(this.apiUrl + "update", jobDescription);
  }
}

