import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnonceService } from '../../../services/annonce.service';
import { Annonce, PhotoInfo } from '../../../models/annonce';
import { PhotoService } from '../../../services/photo.service';
import { firstValueFrom } from "rxjs";

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

  selectedFiles: File[] = [];
  existingPhotos: PhotoInfo[] = [];
  photosToDelete: number[] = [];

  categoriesOptions = ['appartement', 'maison', 'terrain', 'commerce'];
  typesOptions = ['vente', 'location'];

  constructor(
    private formBuilder: FormBuilder,
    private annonceService: AnnonceService,
    private photoService: PhotoService,
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
      contact: ['', [Validators.required, Validators.email]]
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
      this.annonceForm.patchValue({
        titre: annonce.titre,
        description: annonce.description,
        type: annonce.type,
        categorie: annonce.categorie,
        prix: annonce.prix,
        superficie: annonce.superficie,
        nombrePieces: annonce.nombrePieces,
        localisation: annonce.localisation,
        contact: annonce.contact
      });

      // Save existing photos with their IDs
      this.existingPhotos = annonce.photos || [];
      console.log('Loaded existing photos:', this.existingPhotos);

      // Update form validation based on category
      this.onCategorieChange();
    });
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
      }
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  removeExistingPhoto(index: number): void {
    const photo = this.existingPhotos[index];

    // Add to photosToDelete if it has an ID
    if (photo.id) {
      this.photosToDelete.push(photo.id);
      console.log(`Added photo ID ${photo.id} to deletion list`);
    }

    // Remove from display
    this.existingPhotos.splice(index, 1);
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.annonceForm.invalid) {
      return;
    }

    this.loading = true;

    try {
      // 1. Create or update the property first
      const annonceData: Annonce = {
        ...this.annonceForm.value,
        id: this.isEditMode ? this.annonceId : undefined,
        photos: this.existingPhotos,
        datePublication: new Date()
      };

      let savedAnnonce: Annonce;

      if (this.isEditMode && this.annonceId) {
        savedAnnonce = await firstValueFrom(this.annonceService.updateAnnonce(annonceData));
      } else {
        savedAnnonce = await firstValueFrom(this.annonceService.addAnnonce(annonceData));
      }

      // 2. Upload new photos if any
      if (this.selectedFiles.length > 0 && savedAnnonce && savedAnnonce.id) {
        for (let i = 0; i < this.selectedFiles.length; i++) {
          await firstValueFrom(this.photoService.uploadPhoto(
            this.selectedFiles[i],
            savedAnnonce.id,
            i + this.existingPhotos.length
          ));
        }
      }

      // 3. Delete photos if any marked for deletion
      if (this.photosToDelete.length > 0) {
        console.log(`Deleting ${this.photosToDelete.length} photos:`, this.photosToDelete);

        for (const photoId of this.photosToDelete) {
          try {
            await firstValueFrom(this.photoService.deletePhoto(photoId));
            console.log(`Successfully deleted photo with ID: ${photoId}`);
          } catch (error) {
            console.error(`Error deleting photo ID ${photoId}:`, error);
            // Continue with other photos even if one fails
          }
        }
      }

      this.router.navigate(['/admin/annonces']);
    } catch (error) {
      console.error('Error saving property:', error);
    } finally {
      this.loading = false;
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
