// src/app/core/auth.service.ts

import { Injectable }            from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, tap }    from 'rxjs';

export interface User {
  userId:   number;
  name:     string;
  email:    string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5196/api/user';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {}

  /** Login and cache credentials + user */
  login(email: string, password: string): Observable<User> {
    const authHeader = 'Basic ' + btoa(`${email}:${password}`);
    return this.http
      .post<User>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(u => {
          this.currentUser = u;
          localStorage.setItem('authHeader', authHeader);
          localStorage.setItem('currentUser', JSON.stringify(u));
        })
      );
  }

  /** Build Authorization header */
  private buildAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authHeader') ?? '';
    return new HttpHeaders({ Authorization: token });
  }

  /** Return cached user or from localStorage or error */
  getCurrentUser(): Observable<User> {
    if (this.currentUser) {
      return of(this.currentUser);
    }
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const u = JSON.parse(stored) as User;
      this.currentUser = u;
      return of(u);
    }
    // no user → error so component can redirect
    return of(null as any);
  }

  /**
   * Update profile via PUT /api/user/{id},
   * which matches your [HttpPut("{id}")] action.
   */
  updateUser(user: User): Observable<void> {
    return this.http
      .put<void>(
        `${this.apiUrl}/${user.userId}`,   // ← include the /{id}
        user,
        { headers: this.buildAuthHeaders() }
      )
      .pipe(
        tap(() => {
          this.currentUser = user;
          localStorage.setItem('currentUser', JSON.stringify(user));
        })
      );
  }

  /** Delete via DELETE /api/user/{id} */
  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.buildAuthHeaders() }
    );
  }

  /** Clear everything */
  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('authHeader');
    localStorage.removeItem('currentUser');
  }

  /** Registration */
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }
}