import { Component, OnInit } from '@angular/core';
import { CoordonneeServiceService } from 'src/app/services/coordonnee-service.service';
import { mapDataInterface, mapInterface } from 'src/app/DatasInterface';
import { latLng, tileLayer, icon, marker, Icon } from 'leaflet';

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss']
})
export class MapComponentComponent implements OnInit {
  locationData: mapDataInterface[] = [];
  layers: any[] = []
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 10,
    center: latLng(46.20669, 6.14548)
  };


  constructor(
    private readonly _coordonneService: CoordonneeServiceService
  ) { }
  async ngOnInit() {
   this.getposition()
 

  }
  async getposition() {
    const response = await this._coordonneService.getlocation();
    this.locationData = response.data;
    console.log(this.locationData);


    for (const data of this.locationData) {
      const latitude = parseFloat(data.latitude);
      const longitude = parseFloat(data.longitude);
      // console.log("Latitude:", latitude);
      // console.log("Longitude:", longitude);
  
      // Ajoutez chaque marqueur au tableau des couches
      this.layers.push(
        marker([latitude, longitude], {
          icon: icon({
            ...Icon.Default.prototype.options,
            iconUrl: 'assets/marker-icon.png',
            iconRetinaUrl: 'assets/marker-icon-2x.png',
            shadowUrl: 'assets/marker-shadow.png'
          })
        })
      );
    }
  }


  }



