import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponentComponent } from './components/map-component/map-component.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ActivityFilterPipe } from './pipe/activity-filter.pipe';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalComponentComponent } from './components/modal/modal-component/modal-component.component';
import { TitleFilterPipe } from './pipe/title-filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    MapComponentComponent,
    ActivityFilterPipe,
    ModalComponentComponent,
    TitleFilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    LeafletModule,
    IonicModule.forRoot({
      mode: 'ios'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
