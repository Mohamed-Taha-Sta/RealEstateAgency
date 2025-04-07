import { Component, OnInit } from '@angular/core';
import { Annonce } from '../../../models/annonce';
import { AnnonceService } from '../../../services/annonce.service';

@Component({
  selector: 'app-annonces-gestion',
  templateUrl: './annonces-gestion.component.html',
  styleUrls: ['./annonces-gestion.component.scss']
})
export class AnnoncesGestionComponent implements OnInit {
  annonces: Annonce[] = [];
  annoncesFiltrees: Annonce[] = [];
  typeFiltre: 'tous' | 'vente' | 'location' = 'tous';
  searchTerm: string = '';

  constructor(private annonceService: AnnonceService) { }

  ngOnInit(): void {
    this.chargerAnnonces();
  }

  chargerAnnonces(): void {
    this.annonceService.getAnnonces().subscribe(annonces => {
      this.annonces = annonces;
      this.filtrerAnnonces();
    });
  }

  filtrerParType(type: 'tous' | 'vente' | 'location'): void {
    this.typeFiltre = type;
    this.filtrerAnnonces();
  }

  searchAnnonces(): void {
    this.filtrerAnnonces();
  }

  filtrerAnnonces(): void {
    // Filtrer d'abord par type
    let filteredAnnonces = this.annonces;

    if (this.typeFiltre !== 'tous') {
      filteredAnnonces = filteredAnnonces.filter(annonce => annonce.type === this.typeFiltre);
    }

    // Ensuite filtrer par terme de recherche si présent
    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase();
      filteredAnnonces = filteredAnnonces.filter(annonce =>
        annonce.titre.toLowerCase().includes(searchTermLower) ||
        annonce.description.toLowerCase().includes(searchTermLower) ||
        annonce.localisation.toLowerCase().includes(searchTermLower)
      );
    }

    this.annoncesFiltrees = filteredAnnonces;
  }

  confirmerSuppression(annonce: Annonce): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'annonce "${annonce.titre}" ?`)) {
      this.annonceService.deleteAnnonce(annonce.id!).subscribe(() => {
        // Mettre à jour la liste après suppression
        this.annonces = this.annonces.filter(a => a.id !== annonce.id);
        this.filtrerAnnonces();
      });
    }
  }
}
