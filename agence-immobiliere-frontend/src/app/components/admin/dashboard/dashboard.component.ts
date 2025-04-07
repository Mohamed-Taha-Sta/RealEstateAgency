import { Component, OnInit } from '@angular/core';
import { Annonce } from '../../../models/annonce';
import { AnnonceService } from '../../../services/annonce.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalAnnonces = 0;
  annoncesVente = 0;
  annoncesLocation = 0;
  dernieresAnnonces: Annonce[] = [];

  constructor(private annonceService: AnnonceService) { }

  ngOnInit(): void {
    this.annonceService.getAnnonces().subscribe(annonces => {
      this.totalAnnonces = annonces.length;
      this.annoncesVente = annonces.filter(a => a.type === 'vente').length;
      this.annoncesLocation = annonces.filter(a => a.type === 'location').length;
      this.dernieresAnnonces = annonces.slice(0, 5); // 5 dernières annonces
    });
  }

  confirmerSuppression(annonce: Annonce): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'annonce "${annonce.titre}" ?`)) {
      this.annonceService.deleteAnnonce(annonce.id!).subscribe(() => {
        // Mettre à jour la liste après suppression
        this.dernieresAnnonces = this.dernieresAnnonces.filter(a => a.id !== annonce.id);
        this.totalAnnonces--;
        if (annonce.type === 'vente') {
          this.annoncesVente--;
        } else {
          this.annoncesLocation--;
        }
      });
    }
  }
}
