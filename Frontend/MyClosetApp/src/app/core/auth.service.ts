import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  userId:   number;
  name:     string;
  email:    string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5196/api/user';

  constructor(private http: HttpClient) { }

  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(
      'http://localhost:5196/api/user/register',  { 
        name, 
        email, 
        password 
      }
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:5196/api/user/login', {
      email,
      password
    }, { responseType: 'text' as 'json' });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // ← New method: update an existing user
  updateUser(user: User): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${user.userId}`, user);
  }
}
