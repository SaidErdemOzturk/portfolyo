import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

type LoginResponse = {
  token?: string;
  accessToken?: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';

  // apiUrl = 'http://localhost:5019/api/Auth/';
  private readonly apiUrl = 'http://api.saiderdemozturk.com/api/Auth/';

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl + 'login', credentials).pipe(
      tap((res) => {
        const token = res?.token ?? res?.accessToken;
        if (token) {
          localStorage.setItem(AuthService.TOKEN_KEY, token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(AuthService.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

