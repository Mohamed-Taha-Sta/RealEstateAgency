export interface Annonce {
  id?: number;
  titre: string;
  type: 'vente' | 'location';
  categorie: 'maison' | 'terrain';
  superficie: number;
  nombrePieces?: number;
  localisation: string;
  prix: number;
  description: string;
  photos: string[];
  contact: string;
  datePublication: Date;
}
