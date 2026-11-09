import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ResponseModel } from 'src/app/models/responseModel';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private httpClient: HttpClient,
    private loadingService: LoadingService
  ) { }

  apiUrl = "https://api.saiderdemozturk.com/api/Image/";

  add(file: File, projectId: number): Observable<ResponseModel> {
    this.loadingService.show();
    const formData = new FormData();
    formData.append('formFile', file, file.name);
    formData.append('projectId', projectId.toString());

    return this.httpClient.post<ResponseModel>(this.apiUrl + "add", formData).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  delete(id: number): Observable<ResponseModel> {
    this.loadingService.show();
    return this.httpClient.post<ResponseModel>(this.apiUrl + "deletebyid?id=" + id, {}).pipe(
      finalize(() => this.loadingService.hide())
    );
  }
}

