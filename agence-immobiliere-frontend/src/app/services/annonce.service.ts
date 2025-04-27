import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annonce } from '../models/annonce';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {
  private apiUrl = 'http://localhost:8080/api/annonces';

  constructor(private http: HttpClient) {}

  // Get auth headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('currentUser') ?
      JSON.parse(localStorage.getItem('currentUser') || '{}').token : null;

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Get all properties (public)
  getAnnonces(): Observable<Annonce[]> {
    const options = { headers: this.getHeaders() };
    return this.http.get<any[]>(`${this.apiUrl}/public/all`, options).pipe(
      map(properties => this.mapPropertiesToAnnonces(properties))
    );
  }

  // Get property by ID (public)
  getAnnonceById(id: number): Observable<Annonce> {
    return this.http.get<any>(`${this.apiUrl}/public/${id}`).pipe(
      map(property => this.mapPropertyToAnnonce(property))
    );
  }

  // Add a new property (requires admin authentication)
  addAnnonce(annonce: Annonce): Observable<Annonce> {
    const propertyDTO = this.mapAnnonceToProperty(annonce);
    console.log('Mapped property:', propertyDTO);
    // Add the current admin's ID from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.role === 'admin') {
      propertyDTO.adminId = currentUser.id;
    }

    const options = { headers: this.getHeaders() };

    return this.http.post<any>(this.apiUrl, propertyDTO, options).pipe(
      map(property => this.mapPropertyToAnnonce(property))
    );
  }
  // Update a property (requires admin authentication)
  updateAnnonce(annonce: Annonce): Observable<Annonce> {
    const propertyDTO = this.mapAnnonceToProperty(annonce);
    const options = { headers: this.getHeaders() };

    return this.http.put<any>(`${this.apiUrl}/${annonce.id}`, propertyDTO, options).pipe(
      map(property => this.mapPropertyToAnnonce(property))
    );
  }

  // Delete a property (requires admin authentication)
  deleteAnnonce(id: number): Observable<void> {
    const options = { headers: this.getHeaders() };
    return this.http.delete<void>(`${this.apiUrl}/${id}`, options);
  }

  // Get properties by admin ID (requires authentication)
  getAnnoncesByAdminId(adminId: number): Observable<Annonce[]> {
    const options = { headers: this.getHeaders() };
    return this.http.get<any[]>(`${this.apiUrl}/admin/${adminId}`, options).pipe(
      map(properties => this.mapPropertiesToAnnonces(properties))
    );
  }

  // Map backend PropertyDTO to frontend Annonce
  private mapPropertyToAnnonce(property: any): Annonce {

    return {
      id: property.id,
      titre: property.title,
      type: property.listingType === 'SALE' ? 'vente' : 'location',
      categorie: property.type === 'HOUSE' ? 'maison' : 'terrain',
      superficie: property.area,
      nombrePieces: property.rooms,
      localisation: property.location,
      prix: property.price,
      description: property.description,
      photos: property.photos?.map((photo: any) => photo.url) || [],
      contact: property.contact,
      datePublication: new Date(property.publicationDate)
    };
  }

// Update the mapAnnonceToProperty method in annonce.service.ts
  private mapAnnonceToProperty(annonce: Annonce): any {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    // Ensure adminId is definitely set from the currentUser
    if (!currentUser || !currentUser.id) {
      console.error('No current user ID found in localStorage');
      // You could handle this error differently based on your application needs
    }

    // Debug to see if title is being passed correctly
    console.log('Mapping annonce to property:', annonce);

    const propertyDTO = {
      id: annonce.id,
      title: annonce.titre,
      listingType: annonce.type === 'vente' ? 'SALE' : 'RENT',
      type: annonce.categorie === 'maison' ? 'HOUSE' : 'LAND',
      area: annonce.superficie,
      rooms: annonce.nombrePieces,
      location: annonce.localisation,
      price: annonce.prix,
      description: annonce.description,
      contact: annonce.contact,
      status: 'ACTIVE',
      adminId: currentUser.id // Make sure this is properly set
    };

    console.log('Mapped property DTO:', propertyDTO);
    return propertyDTO;
  }
  // Map an array of properties to an array of annonces
  private mapPropertiesToAnnonces(properties: any[]): Annonce[] {
    return properties.map(property => this.mapPropertyToAnnonce(property));
  }
}
