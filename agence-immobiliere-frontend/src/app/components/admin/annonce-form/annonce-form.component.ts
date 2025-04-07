import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  import { AnnonceService } from '../../../services/annonce.service';
  import { Annonce } from '../../../models/annonce';

  @Component({
    selector: 'app-annonce-form',
    templateUrl: './annonce-form.component.html',
    styleUrls: ['./annonce-form.component.scss']
  })
  export class AnnonceFormComponent implements OnInit {
    annonceForm: FormGroup;
    isEditMode = false;
    submitted = false;
    loading = false;
    annonceId?: number;

    categoriesOptions = ['appartement', 'maison', 'terrain', 'commerce'];
    typesOptions = ['vente', 'location'];

    constructor(
      private formBuilder: FormBuilder,
      private annonceService: AnnonceService,
      private router: Router,
      private route: ActivatedRoute
    ) {
      this.annonceForm = this.formBuilder.group({
        titre: ['', [Validators.required, Validators.minLength(5)]],
        description: ['', [Validators.required, Validators.minLength(20)]],
        type: ['', Validators.required],
        categorie: ['', Validators.required],
        prix: ['', [Validators.required, Validators.min(0)]],
        superficie: ['', [Validators.required, Validators.min(0)]],
        nombrePieces: [''],
        localisation: ['', Validators.required],
        contact: ['', [Validators.required, Validators.email]],
        photos: ['']
      });
    }

    ngOnInit(): void {
      this.route.params.subscribe(params => {
        if (params['id']) {
          this.isEditMode = true;
          this.annonceId = +params['id'];
          this.loadAnnonce(this.annonceId);
        }
      });
    }

    loadAnnonce(id: number): void {
      this.annonceService.getAnnonceById(id).subscribe(annonce => {
        this.annonceForm.patchValue(annonce);
      });
    }

    onSubmit(): void {
      this.submitted = true;

      if (this.annonceForm.invalid) {
        return;
      }

      this.loading = true;
      const annonceData: Annonce = this.annonceForm.value;

      if (this.isEditMode && this.annonceId) {
        this.annonceService.updateAnnonce(annonceData).subscribe({
          next: () => {
            this.router.navigate(['/admin/annonces']);
          },
          error: (error: Error) => {
            console.error('Erreur lors de la mise à jour:', error);
            this.loading = false;
          }
        });
      } else {
        this.annonceService.addAnnonce(annonceData).subscribe({
          next: () => {
            this.router.navigate(['/admin/annonces']);
          },
          error: (error: Error) => {
            console.error('Erreur lors de la création:', error);
            this.loading = false;
          }
        });
      }
    }

    onCategorieChange(): void {
      const categorieControl = this.annonceForm.get('categorie');
      const nombrePiecesControl = this.annonceForm.get('nombrePieces');

      if (categorieControl?.value === 'terrain') {
        nombrePiecesControl?.setValue(null);
        nombrePiecesControl?.disable();
      } else {
        nombrePiecesControl?.enable();
      }
    }
  }
