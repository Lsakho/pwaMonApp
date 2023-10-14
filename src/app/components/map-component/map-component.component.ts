import { Component, OnInit } from '@angular/core';
import { CoordonneeServiceService } from 'src/app/services/coordonnee-service.service';
import { mapDataInterface, mapInterface } from 'src/app/DatasInterface';
import { latLng, tileLayer, icon, marker, Icon, Marker } from 'leaflet';
import { ActivityFilterPipe } from '../../pipe/activity-filter.pipe'
import { BehaviorSubject , Observable, map, combineLatest} from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ModalComponentComponent } from '../modal/modal-component/modal-component.component';

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss']
})
export class MapComponentComponent implements OnInit {
  locationData: mapDataInterface[] = [];
  selectedActivity: string = 'Toutes';
  
  selectedActivity$: BehaviorSubject<string> = new BehaviorSubject('Toutes');
  private _locationData$: BehaviorSubject<mapDataInterface[]> = new BehaviorSubject([] as mapDataInterface[])
  locationData$: Observable<mapDataInterface[]> = combineLatest([
    this._locationData$.asObservable(),
    this.selectedActivity$.asObservable()
  ]).pipe(
    map(([locations, selectedActivity])=> {
      return  new ActivityFilterPipe().transform(locations, selectedActivity)
    })
  );
  layers$:Observable<Marker<any>[]> = this.locationData$.pipe(
    map(locations => {
      const layers = [];
      for (const data of locations) {
        const latitude = parseFloat(data.latitude);
        const longitude = parseFloat(data.longitude);
        // console.log("Latitude:", latitude);
        // console.log("Longitude:", longitude);
    
        // Ajoutez chaque marqueur au tableau des couches
        layers.push(
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
      return layers;
    })
  )

  layers: any[] = []
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 13,
    center: latLng(46.20669, 6.14548)
  };


  constructor(
    private readonly _coordonneService: CoordonneeServiceService,
    private readonly modalCtrl: ModalController
  ) { }
  async ngOnInit() {
   this.getposition()
 

  }
  async getposition() {
    const response = await this._coordonneService.getlocation();
    this._locationData$.next(response.data);
    
    this.locationData = new ActivityFilterPipe().transform(response.data, this.selectedActivity)
    console.log(this.locationData);


    for (const data of this.locationData) {
      const latitude = parseFloat(data.latitude);
      const longitude = parseFloat(data.longitude);
      // console.log("Latitude:", latitude);
      // console.log("Longitude:", longitude);
  

      const customMarker = marker([latitude, longitude], {
        icon: icon({
          ...Icon.Default.prototype.options,
          iconUrl: 'assets/marker-icon.png',
          iconRetinaUrl: 'assets/marker-icon-2x.png',
          shadowUrl: 'assets/marker-shadow.png'
        })
      });

      customMarker.addEventListener('click', () => {
        this.openModal();
      });

      this.layers.push(customMarker);
    }
  }


  filterByActivity(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedActivity = target.value;
    this.selectedActivity$.next(target.value);
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponentComponent,
  
    });
    return await modal.present();
  }

  



  }



