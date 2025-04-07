import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnonceFormComponent } from './annonce-form.component';

describe('AnnonceFormComponent', () => {
  let component: AnnonceFormComponent;
  let fixture: ComponentFixture<AnnonceFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnonceFormComponent]
    });
    fixture = TestBed.createComponent(AnnonceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
