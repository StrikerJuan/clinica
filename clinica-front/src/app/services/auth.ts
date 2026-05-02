import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface TokenResponse {
   access: string;
   refresh: string;
}

@Injectable({
   providedIn: 'root',
})
export class Auth {
   private apiUrl = 'http://localhost:8000/api/auth';

   constructor(private http: HttpClient) { }

   getRefreshToken(): string | null {
      return localStorage.getItem('refresh_token');
   }

   login(username: string, password: string): Observable<TokenResponse> {
      return this.http.post<TokenResponse>(`${this.apiUrl}/login/`, { username, password }).pipe(
         tap((tokens) => {
            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);
         }),
      );
   }

   refreshToken(): Observable<TokenResponse> {
      const refresh = localStorage.getItem('refresh_token');
      return this.http.post<TokenResponse>(`${this.apiUrl}/refresh/`, { refresh }).pipe(
         tap((tokens) => {
            localStorage.setItem('access_token', tokens.access);
         }),
      );
   }

   logout(): void {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
   }

   getToken(): string | null {
      return localStorage.getItem('access_token');
   }

   isLoggedIn(): boolean {
      return !!this.getToken();
   }
}