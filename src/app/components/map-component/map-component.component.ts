import { Component, OnInit } from '@angular/core';
import { CoordonneeServiceService } from 'src/app/services/coordonnee-service.service';
import { mapDataInterface, mapInterface } from 'src/app/DatasInterface';
import { latLng, tileLayer, icon, marker,Icon } from 'leaflet';

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss']
})
export class MapComponentComponent implements OnInit {
  locationData: mapDataInterface[] = [];
  layers: any[] = [];


  constructor(
    private readonly _coordonneService: CoordonneeServiceService
  ){}
  async ngOnInit() {
    this.getposition()
    this.options
    
  }
  async getposition(){
    this.locationData = await this._coordonneService.getlocation();
    if (this.locationData.length > 0) {
      console.log(this.locationData[0].adresse); // Accéder à la propriété "title" du premier élément
      console.log(this.locationData[0].latitude); // Accéder à la propriété "latitude" du premier élément
      console.log(this.locationData[0].longitude); // Accéder à la propriété "adresse" du premier élément
    }
    const latitude = parseFloat(this.locationData[0].latitude);
    const longitude = parseFloat(this.locationData[0].longitude);

this.layers = [
  marker([latitude, longitude], {
    icon: icon({
      ...Icon.Default.prototype.options,
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png'
    })
  })
];

  
  };
  
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 10,
    center: latLng( 46.20669,6.14548)
  };



}
