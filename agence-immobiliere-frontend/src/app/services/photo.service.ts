import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = 'http://localhost:8080/api/photos';

  constructor(private http: HttpClient) {}

  // Get auth headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('currentUser') ?
      JSON.parse(localStorage.getItem('currentUser') || '{}').token : null;

    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Upload a photo for a property
  uploadPhoto(file: File, propertyId: number, order: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('propertyId', propertyId.toString());
    formData.append('order', order.toString());

    const options = { headers: this.getHeaders() };

    return this.http.post<any>(`${this.apiUrl}/upload`, formData, options);
  }

  // Get photos by property ID
  getPhotosByPropertyId(propertyId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/property/${propertyId}`);
  }

  // Delete a photo
  deletePhoto(photoId: number): Observable<void> {
    const options = { headers: this.getHeaders() };
    return this.http.delete<void>(`${this.apiUrl}/${photoId}`, options);
  }
}
