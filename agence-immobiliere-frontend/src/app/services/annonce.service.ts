import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Annonce} from '../models/annonce';

@Injectable({
  providedIn: 'root'
})
export class AnnonceService {
  private apiUrl = 'http://localhost:8080/api/annonces';

  // Données fictives pour développement
  private mockAnnonces: Annonce[] = [
    {
      id: 1,
      titre: 'Villa spacieuse avec jardin',
      type: 'vente',
      categorie: 'maison',
      superficie: 200,
      nombrePieces: 5,
      localisation: 'Tunis',
      prix: 450000,
      description: 'Belle villa avec piscine et grand jardin',
      photos: ['assets/images/villa1.jpg', 'assets/images/villa2.jpg'],
      contact: 'contact@agence.com',
      datePublication: new Date()
    },
    {
      id: 2,
      titre: 'Terrain constructible',
      type: 'vente',
      categorie: 'terrain',
      superficie: 500,
      localisation: 'Sousse',
      prix: 120000,
      description: 'Terrain idéal pour construction',
      photos: ['assets/images/terrain1.jpg'],
      contact: 'contact@agence.com',
      datePublication: new Date()
    },
    {
      id: 3,
      titre: 'Appartement meublé',
      type: 'location',
      categorie: 'maison',
      superficie: 85,
      nombrePieces: 3,
      localisation: 'Sfax',
      prix: 800,
      description: 'Appartement meublé proche de toutes commodités',
      photos: ['assets/images/appart1.jpg'],
      contact: 'contact@agence.com',
      datePublication: new Date()
    }
  ];

  constructor(private http: HttpClient) {
  }

  // Obtenir toutes les annonces
  getAnnonces(): Observable<Annonce[]> {
    // Pour le développement, retournez les données mock
    return of(this.mockAnnonces);

    // Quand le backend est prêt, utilisez :
    // return this.http.get<Annonce[]>(this.apiUrl);
  }

  // Obtenir une annonce par ID
  getAnnonceById(id: number): Observable<Annonce> {
    const annonce = this.mockAnnonces.find(a => a.id === id);
    return of(annonce as Annonce);

    // Avec backend :
    // return this.http.get<Annonce>(`${this.apiUrl}/${id}`);
  }

  // Ajouter une annonce
  addAnnonce(annonce: Annonce): Observable<Annonce> {
    // Format photo paths
    if (annonce.photos && typeof annonce.photos === 'string') {
      annonce.photos = (annonce.photos as string)
        .split(',')
        .map((photo: string) => photo.trim())
        .map((photo: string) => photo.startsWith('/assets/') ? photo : `/assets/images/${photo}`);
    }

    // Create new annonce
    const newAnnonce = {
      ...annonce,
      id: this.mockAnnonces.length + 1,
      datePublication: new Date(),
      photos: annonce.photos || []
    };

    console.log("New annonce created:", newAnnonce);

    this.mockAnnonces.push(newAnnonce);
    return of(newAnnonce);
  }

  // Mettre à jour une annonce
  updateAnnonce(annonce: Annonce): Observable<Annonce> {
    const index = this.mockAnnonces.findIndex(a => a.id === annonce.id);
    if (index >= 0) {
      this.mockAnnonces[index] = annonce;
    }
    return of(annonce);

    // Avec backend :
    // return this.http.put<Annonce>(`${this.apiUrl}/${annonce.id}`, annonce);
  }

  // Supprimer une annonce
  deleteAnnonce(id: number): Observable<void> {
    const index = this.mockAnnonces.findIndex(a => a.id === id);
    if (index >= 0) {
      this.mockAnnonces.splice(index, 1);
    }
    return of(void 0);

    // Avec backend :
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
