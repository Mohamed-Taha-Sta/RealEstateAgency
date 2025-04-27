import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Annonce } from '../models/annonce';

export interface RechercheParams {
  type?: 'vente' | 'location';
  categorie?: 'maison' | 'terrain';
  localisation?: string;
  prixMin?: number;
  prixMax?: number;
  superficieMin?: number;
  superficieMax?: number;
  nombrePiecesMin?: number;
  nombrePiecesMax?: number;
}

@Injectable({
  providedIn: 'root'
})
export class RechercheService {
  private apiUrl = 'http://localhost:8080/api/annonces/public/search';

  constructor(private http: HttpClient) {}

  rechercherAnnonces(params: RechercheParams): Observable<Annonce[]> {
    // Convert frontend search params to backend search criteria
    const searchCriteria = {
      title: null,
      location: params.localisation,
      minPrice: params.prixMin,
      maxPrice: params.prixMax,
      minArea: params.superficieMin,
      maxArea: params.superficieMax,
      minRooms: params.nombrePiecesMin,
      maxRooms: params.nombrePiecesMax,
      type: params.categorie === 'maison' ? 'HOUSE' : params.categorie === 'terrain' ? 'LAND' : null,
      listingType: params.type === 'vente' ? 'SALE' : params.type === 'location' ? 'RENTAL' : null
    };

    return this.http.post<any[]>(this.apiUrl, searchCriteria).pipe(
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

  // Map an array of properties to an array of annonces
  private mapPropertiesToAnnonces(properties: any[]): Annonce[] {
    return properties.map(property => this.mapPropertyToAnnonce(property));
  }
}
