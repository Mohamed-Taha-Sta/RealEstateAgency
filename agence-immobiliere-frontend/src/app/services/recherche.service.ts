import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Annonce} from '../models/annonce';
import {AnnonceService} from './annonce.service';

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

  constructor(private annonceService: AnnonceService) {
  }

  rechercherAnnonces(params: RechercheParams): Observable<Annonce[]> {
    return this.annonceService.getAnnonces()
      .pipe(
        map(annonces => this.filtrerAnnonces(annonces, params))
      );
  }

  private filtrerAnnonces(annonces: Annonce[], params: RechercheParams): Annonce[] {
    return annonces.filter(annonce => {
      // Filtrer par type
      if (params.type && annonce.type !== params.type) {
        return false;
      }

      // Filtrer par catégorie
      if (params.categorie && annonce.categorie !== params.categorie) {
        return false;
      }

      // Filtrer par localisation
      if (params.localisation && !annonce.localisation.toLowerCase().includes(params.localisation.toLowerCase())) {
        return false;
      }

      // Filtrer par prix
      if (params.prixMin && annonce.prix < params.prixMin) {
        return false;
      }
      if (params.prixMax && annonce.prix > params.prixMax) {
        return false;
      }

      // Filtrer par superficie
      if (params.superficieMin && annonce.superficie < params.superficieMin) {
        return false;
      }
      if (params.superficieMax && annonce.superficie > params.superficieMax) {
        return false;
      }

      // Filtrer par nombre de pièces
      if (params.nombrePiecesMin && annonce.nombrePieces && annonce.nombrePieces < params.nombrePiecesMin) {
        return false;
      }
      if (params.nombrePiecesMax && annonce.nombrePieces && annonce.nombrePieces > params.nombrePiecesMax) {
        return false;
      }

      return true;
    });
  }
}
