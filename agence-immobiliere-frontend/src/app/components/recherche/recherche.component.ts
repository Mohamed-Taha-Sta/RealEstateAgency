import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Annonce } from '../../models/annonce';
import { RechercheService, RechercheParams } from '../../services/recherche.service';

@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.component.html',
  styleUrls: ['./recherche.component.scss']
})
export class RechercheComponent implements OnInit {
  rechercheForm: FormGroup;
  resultatsRecherche: Annonce[] = [];
  rechercheSoumise = false;

  constructor(
    private formBuilder: FormBuilder,
    private rechercheService: RechercheService
  ) {
    this.rechercheForm = this.formBuilder.group({
      type: [''],
      categorie: [''],
      localisation: [''],
      prixMin: [''],
      prixMax: [''],
      superficieMin: [''],
      superficieMax: [''],
      nombrePiecesMin: [''],
      nombrePiecesMax: ['']
    });
  }

  ngOnInit(): void {
    // Observe les changements de la catégorie pour afficher ou masquer certains champs
    this.rechercheForm.get('categorie')?.valueChanges.subscribe(value => {
      if (value === 'terrain') {
        this.rechercheForm.get('nombrePiecesMin')?.setValue('');
        this.rechercheForm.get('nombrePiecesMax')?.setValue('');
      }
    });
  }

  onSubmit(): void {
    this.rechercheSoumise = true;
    const params: RechercheParams = {
      type: this.rechercheForm.get('type')?.value || undefined,
      categorie: this.rechercheForm.get('categorie')?.value || undefined,
      localisation: this.rechercheForm.get('localisation')?.value || undefined,
      prixMin: this.rechercheForm.get('prixMin')?.value || undefined,
      prixMax: this.rechercheForm.get('prixMax')?.value || undefined,
      superficieMin: this.rechercheForm.get('superficieMin')?.value || undefined,
      superficieMax: this.rechercheForm.get('superficieMax')?.value || undefined,
      nombrePiecesMin: this.rechercheForm.get('nombrePiecesMin')?.value || undefined,
      nombrePiecesMax: this.rechercheForm.get('nombrePiecesMax')?.value || undefined
    };

    this.rechercheService.rechercherAnnonces(params).subscribe(annonces => {
      this.resultatsRecherche = annonces;
    });
  }

  resetForm(): void {
    this.rechercheForm.reset();
    this.rechercheSoumise = false;
    this.resultatsRecherche = [];
  }
}
