import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResponseModel } from 'src/app/models/listResponseModel';
import { ProjectDto } from 'src/app/models/projectDto';
import { ProjectWithTech } from 'src/app/models/projectWithTech';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private httpClient:HttpClient) { }

  //apiUrl="http://localhost:5019/api/Project/"
  apiUrl="https://api.saiderdemozturk.com/api/Project/"

  getProjectsDto():Observable<ListResponseModel<ProjectDto>>{
    return this.httpClient.get<ListResponseModel<ProjectDto>>(this.apiUrl+"getallwithdto");
  }
  getMoreProjectsDto():Observable<ListResponseModel<ProjectWithTech>>{
    return this.httpClient.get<ListResponseModel<ProjectWithTech>>(this.apiUrl+"getmoreproject");
  }


}
