import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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

  /* Call after successful login, and stores the returned User in memory */
  login(email: string, password: string): Observable<User> {
    const authHeader = 'Basic ' + btoa(`${email}:${password}`); //generate header
  
    return this.http
      .post<User>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(u => {
          console.log('AuthService got user:', u);
          this.currentUser = u;
  
          localStorage.setItem('authHeader', authHeader); //store it for future fetch() calls
        })
      );
  }

  /* Profile component will call this */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /* To save edits to the profile */
  updateUser(user: User): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${user.userId}`, user);
  }

  /* Registration */
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }


/** Fetch one user by their id */
getUserById(id: number): Observable<User> {
  return this.http.get<User>(`${this.apiUrl}/${id}`);
}
}