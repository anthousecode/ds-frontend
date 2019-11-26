import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TalonComponent} from './components/talon/talon.component';
import {PatientCardComponent} from './components/patient-card/patient-card.component';
import {ErrorPageComponent} from './components/error-page/error-page.component';
import { SearchChildComponent } from './components/search-child/search-child.component';
import {HomeComponent} from './components/home/home.component';
import {CardCreateComponent} from './components/card-create/card-create.component';
import {CardThirteenYComponent} from './components/card-thirteen-y/card-thirteen-y.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'talon', component: TalonComponent},
  {path: 'talon/:id', component: TalonComponent},
  {path: 'patient-card', component: PatientCardComponent},
  {path: 'patient-card/:id', component: PatientCardComponent},
  {path: 'search-child', component: SearchChildComponent},
  {path: 'card-create', component: CardCreateComponent},
  {path: 'card-13y', component: CardThirteenYComponent},
  {path: '404', component: ErrorPageComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
