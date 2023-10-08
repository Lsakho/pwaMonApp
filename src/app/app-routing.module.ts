import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponentComponent } from './components/map-component/map-component.component';


const routes: Routes = [
  {
    path: 'home',
    component: MapComponentComponent
  },
 

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
