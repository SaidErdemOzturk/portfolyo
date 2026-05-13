import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import type { LoginTokenModel } from '../../models/auth/loginTokenModel';

const STORAGE_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class AuthTokenStorageService {
  private memory: LoginTokenModel | null = null;
  private tokenSubject = new BehaviorSubject<LoginTokenModel | null>(null);

  /** Current token (null if none). */
  readonly token$ = this.tokenSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.tokenSubject.next(this.read());
  }

  set(token: LoginTokenModel): void {
    const storage = this.getStorage();
    if (storage) {
      storage.setItem(STORAGE_KEY, JSON.stringify(token));
    } else {
      this.memory = token;
    }
    this.tokenSubject.next(token);
  }

  get(): LoginTokenModel | null {
    return this.read();
  }

  getAccessToken(): string | null {
    return this.read()?.token ?? null;
  }

  clear(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem(STORAGE_KEY);
    }
    this.memory = null;
    this.tokenSubject.next(null);
  }

  /** True if token is missing or expired (optionally with leeway). */
  isExpired(leewaySeconds = 0): boolean {
    const token = this.read();
    if (!token?.expiration) return true;
    const expMs = Date.parse(token.expiration);
    if (Number.isNaN(expMs)) return true;
    return expMs <= Date.now() + leewaySeconds * 1000;
  }

  private read(): LoginTokenModel | null {
    const storage = this.getStorage();
    if (storage) {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as LoginTokenModel;
      } catch {
        // Backward compatibility: old format may store only the raw access token string.
        return { token: raw, expiration: '' };
      }
    }
    return this.memory;
  }

  private getStorage(): Storage | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      return window.localStorage ?? null;
    } catch {
      return null;
    }
  }
}

