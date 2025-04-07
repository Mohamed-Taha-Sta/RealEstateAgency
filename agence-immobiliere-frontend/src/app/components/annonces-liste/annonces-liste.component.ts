import { Component, OnInit } from '@angular/core';
import { Annonce } from '../../models/annonce';
import { AnnonceService } from '../../services/annonce.service';

@Component({
  selector: 'app-annonces-liste',
  templateUrl: './annonces-liste.component.html',
  styleUrls: ['./annonces-liste.component.scss']
})
export class AnnoncesListeComponent implements OnInit {
  annonces: Annonce[] = [];
  annoncesFiltrees: Annonce[] = [];
  typeFiltre: 'tous' | 'vente' | 'location' = 'tous';
  categorieFiltre: 'tous' | 'maison' | 'terrain' = 'tous';

  constructor(private annonceService: AnnonceService) { }

  ngOnInit(): void {
    this.annonceService.getAnnonces().subscribe(annonces => {
      this.annonces = annonces;
      this.filtrerAnnonces();
    });
  }

  filtrerParType(type: 'tous' | 'vente' | 'location'): void {
    this.typeFiltre = type;
    this.filtrerAnnonces();
  }

  filtrerParCategorie(categorie: 'tous' | 'maison' | 'terrain'): void {
    this.categorieFiltre = categorie;
    this.filtrerAnnonces();
  }

  filtrerAnnonces(): void {
    this.annoncesFiltrees = this.annonces.filter(annonce => {
      // Filtrer par type
      if (this.typeFiltre !== 'tous' && annonce.type !== this.typeFiltre) {
        return false;
      }

      // Filtrer par catégorie
      if (this.categorieFiltre !== 'tous' && annonce.categorie !== this.categorieFiltre) {
        return false;
      }

      return true;
    });
  }
}
