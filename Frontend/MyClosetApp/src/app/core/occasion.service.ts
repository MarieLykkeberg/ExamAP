import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Occasion {
    occasionId: number;
    occasionName: string;
  }

@Injectable({
  providedIn: 'root'
})
export class OccasionService {
  private apiUrl = 'http://localhost:5196/api/occasion';

  constructor(private http: HttpClient) {}

  // GET: all occasions
  getOccasions(): Observable<Occasion[]> {
    const authHeader = localStorage.getItem('authHeader') || '';

    const headers = new HttpHeaders({
      'Authorization': authHeader
    });

    return this.http.get<Occasion[]>(this.apiUrl, { headers });
}
}