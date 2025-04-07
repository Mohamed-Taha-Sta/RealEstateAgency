import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AnnoncesListeComponent } from './components/annonces-liste/annonces-liste.component';
import { AnnonceDetailsComponent } from './components/annonce-details/annonce-details.component';
import { RechercheComponent } from './components/recherche/recherche.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AnnoncesGestionComponent } from './components/admin/annonces-gestion/annonces-gestion.component';
import { AnnonceFormComponent } from './components/admin/annonce-form/annonce-form.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AnnoncesListeComponent,
    AnnonceDetailsComponent,
    RechercheComponent,
    LoginComponent,
    DashboardComponent,
    AnnoncesGestionComponent,
    AnnonceFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
