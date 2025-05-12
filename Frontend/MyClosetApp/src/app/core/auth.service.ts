import { Injectable }            from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of }    from 'rxjs';
import { tap } from 'rxjs/operators';

// Defines the structure of a user in our application
export interface User {
  userId:   number;
  name:     string;
  email:    string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5196/api/user';
  // Stores the currently logged in user
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {}

  // Handles user login, sets auth header and stores user data
  login(email: string, password: string): Observable<User> {
    const authHeader = 'Basic ' + btoa(`${email}:${password}`);
    
    // Create a new Observable that will handle storing the user data
    return new Observable<User>(observer => {
      this.http.post<User>(`${this.apiUrl}/login`, { email, password }).subscribe({
        next: (user: User) => {
          // Store user data and auth header
          this.currentUser = user;
          localStorage.setItem('authHeader', authHeader);
          localStorage.setItem('currentUser', JSON.stringify(user));
          
          // Pass the user data to the component
          observer.next(user);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  // Creates the authorization header for API requests
  private buildAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authHeader') ?? '';
    return new HttpHeaders({ Authorization: token });
  }

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
    return of(null as any);
  }

  updateUser(user: User): Observable<void> {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return this.http.put<void>(
      `${this.apiUrl}/${user.userId}`,
      user,
      { headers: this.buildAuthHeaders() }
    );
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.buildAuthHeaders() }
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('authHeader');
    localStorage.removeItem('currentUser');
  }

  register(name: string, email: string, password: string): Observable<any> {
    // Clear any existing user data first
    this.logout();
    
    // Set auth header for the new user
    const authHeader = 'Basic ' + btoa(`${email}:${password}`);
    localStorage.setItem('authHeader', authHeader);
    
    // Create the new user account
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }

  }