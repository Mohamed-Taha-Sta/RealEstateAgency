import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncesListeComponent } from './annonces-liste.component';

describe('AnnoncesListeComponent', () => {
  let component: AnnoncesListeComponent;
  let fixture: ComponentFixture<AnnoncesListeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnoncesListeComponent]
    });
    fixture = TestBed.createComponent(AnnoncesListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
