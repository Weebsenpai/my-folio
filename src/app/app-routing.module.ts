import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillsComponent } from './skills/skills.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { ExperinceComponent } from './experince/experince.component';
import { LoadingComponent } from './loading/loading.component';

const routes: Routes = [
  { path: '', redirectTo: 'loading', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'skills', component: SkillsComponent },
  { path: 'menu', component: MenuComponent},
  { path: 'welcome', component: HomeComponent},
  { path: 'experience', component: ExperinceComponent},
  { path: 'loading', component: LoadingComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
