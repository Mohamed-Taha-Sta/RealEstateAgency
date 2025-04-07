import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AnnoncesListeComponent } from './components/annonces-liste/annonces-liste.component';
import { AnnonceDetailsComponent } from './components/annonce-details/annonce-details.component';
import { RechercheComponent } from './components/recherche/recherche.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { AnnoncesGestionComponent } from './components/admin/annonces-gestion/annonces-gestion.component';
import { AnnonceFormComponent } from './components/admin/annonce-form/annonce-form.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'annonces', component: AnnoncesListeComponent },
  { path: 'annonces/:id', component: AnnonceDetailsComponent },
  { path: 'recherche', component: RechercheComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'annonces', component: AnnoncesGestionComponent },
      { path: 'annonces/nouveau', component: AnnonceFormComponent },
      { path: 'annonces/editer/:id', component: AnnonceFormComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
