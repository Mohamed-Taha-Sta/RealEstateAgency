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
  photos?: PhotoInfo[];
  contact: string;
  datePublication: Date;
}

export interface PhotoInfo {
  id: number;
  url: string;
}
