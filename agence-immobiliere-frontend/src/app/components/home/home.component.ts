import { Component, OnInit } from '@angular/core';
import { Annonce } from '../../models/annonce';
import { AnnonceService } from '../../services/annonce.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dernieresAnnonces: Annonce[] = [];

  constructor(private annonceService: AnnonceService) { }

  ngOnInit(): void {
    this.annonceService.getAnnonces().subscribe(annonces => {
      // Récupérer les 3 dernières annonces
      this.dernieresAnnonces = annonces.slice(0, 3);
    });
  }
}
