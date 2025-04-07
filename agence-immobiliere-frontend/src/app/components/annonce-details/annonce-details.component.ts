import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Annonce } from '../../models/annonce';
import { AnnonceService } from '../../services/annonce.service';

@Component({
  selector: 'app-annonce-details',
  templateUrl: './annonce-details.component.html',
  styleUrls: ['./annonce-details.component.scss']
})
export class AnnonceDetailsComponent implements OnInit {
  annonce: Annonce | undefined;
  loading = true;

  constructor(
    private annonceService: AnnonceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.annonceService.getAnnonceById(id).subscribe(
        annonce => {
          this.annonce = annonce;
          this.loading = false;
        },
        error => {
          console.error('Erreur lors du chargement de l\'annonce:', error);
          this.loading = false;
        }
      );
    });
  }
}
