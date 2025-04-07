import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncesGestionComponent } from './annonces-gestion.component';

describe('AnnoncesGestionComponent', () => {
  let component: AnnoncesGestionComponent;
  let fixture: ComponentFixture<AnnoncesGestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnoncesGestionComponent]
    });
    fixture = TestBed.createComponent(AnnoncesGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
