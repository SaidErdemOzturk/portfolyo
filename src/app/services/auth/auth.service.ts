import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoginResponseModel } from 'src/app/models/auth/loginResponseModel';
import { AuthTokenStorageService } from './auth-token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // apiUrl = 'https://api.saiderdemozturk.com/api/Auth/';
  private readonly apiUrl = 'https://api.saiderdemozturk.com/api/Auth/';

  constructor(
    private http: HttpClient,
    private authTokenStorage: AuthTokenStorageService
  ) {}

  login(credentials: { email: string; password: string }): Observable<LoginResponseModel> {
    return this.http
      .post<LoginResponseModel>(this.apiUrl + 'login', credentials)
      .pipe(
        tap((res) => {
          if (res?.success && res.data?.token) {
            this.authTokenStorage.set(res.data);
          }
        })
      );
  }

  logout(): void {
    this.authTokenStorage.clear();
  }

  getToken(): string | null {
    return this.authTokenStorage.getAccessToken();
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

