import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiBaseUrl;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  register(email: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/api/auth/register`, {
      email,
      password
    });
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/api/auth/login`, {
      email,
      password
    });
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  // ✅ FIXED HERE
  getUserRole(): 'admin' | 'user' | null {
    const token = this.getToken(); // ✅ SAME KEY
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.role || null;
    } catch {
      return null;
    }
  }
}
