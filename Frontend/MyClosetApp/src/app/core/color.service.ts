import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Color {
  colorId: number;
  colorName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private apiUrl = 'http://localhost:5196/api/color';

  constructor(private http: HttpClient) {}

  // GET: Fetch all colors
  getColors(): Observable<Color[]> {
    const authHeader = localStorage.getItem('authHeader') || '';

    const headers = new HttpHeaders({
      'Authorization': authHeader
    });

    return this.http.get<Color[]>(this.apiUrl, { headers });
}
}