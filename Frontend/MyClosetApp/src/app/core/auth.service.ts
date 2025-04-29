import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}