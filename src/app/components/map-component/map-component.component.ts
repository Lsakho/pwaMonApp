import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CoordonneeServiceService } from 'src/app/services/coordonnee-service.service';
import { mapDataInterface, mapInterface } from 'src/app/DatasInterface';
import { latLng, tileLayer, icon, marker, Icon, Marker} from 'leaflet';
import * as L from 'leaflet';
import { ActivityFilterPipe } from '../../pipe/activity-filter.pipe'
import { BehaviorSubject , Observable, map, combineLatest, firstValueFrom} from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ModalComponentComponent } from '../modal/modal-component/modal-component.component';
import { TitleFilterPipe } from 'src/app/pipe/title-filter.pipe';

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss']
})
export class MapComponentComponent implements OnInit, AfterViewInit {
  locationData: mapDataInterface[] = [];
  selectedActivity: string = 'Toutes';
  displayMap = false; // for the display map
  showMore: boolean = false; // for the buttons


  
  selectedActivity$: BehaviorSubject<string> = new BehaviorSubject('Toutes');
  private _locationData$: BehaviorSubject<mapDataInterface[]> = new BehaviorSubject([] as mapDataInterface[])
  locationData$: Observable<mapDataInterface[]> = combineLatest([
    this._locationData$.asObservable(),
    this.selectedActivity$.asObservable(),

  ]).pipe(
    map(([locations, selectedActivity, ])=> {
      // filtrer location
      // const locationData = locations.filter((location) => location.title.toLowerCase().includes(searchTerm));

      return  new ActivityFilterPipe().transform(locations, selectedActivity)
    }),
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
            }),
            title: data.title
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
  ngAfterViewInit() {
    setTimeout(()=>{
     this.displayMap = true;
    }, 1500)
    
  }
  async getposition() {
    const response = await this._coordonneService.getlocation();
    this._locationData$.next(response.data);
    
    this.locationData = new ActivityFilterPipe().transform(response.data, this.selectedActivity)
    console.log(this.locationData);


    // for (const data of this.locationData) {
    //   const latitude = parseFloat(data.latitude);
    //   const longitude = parseFloat(data.longitude);
    //   // console.log("Latitude:", latitude);
    //   // console.log("Longitude:", longitude);
  

    //   const customMarker = marker([latitude, longitude], {
    //     icon: icon({
    //       ...Icon.Default.prototype.options,
    //       iconUrl: 'assets/marker-icon.png',
    //       iconRetinaUrl: 'assets/marker-icon-2x.png',
    //       shadowUrl: 'assets/marker-shadow.png'
    //     })
    //   });

    //   customMarker.addEventListener('click', () => {
    //     this.openModal();
    //   });

    //   this.layers.push(customMarker);
    // }
    // this.updateMarkers();
  }
  // updateMarkers() {
  //   this.layers = [];
  //   for (const data of this.locationData) {
  //     const latitude = parseFloat(data.latitude);
  //     const longitude = parseFloat(data.longitude);
  //     const customMarker = marker([latitude, longitude], {
  //       icon: icon({
  //         ...Icon.Default.prototype.options,
  //         iconUrl: 'assets/marker-icon.png',
  //         iconRetinaUrl: 'assets/marker-icon-2x.png',
  //         shadowUrl: 'assets/marker-shadow.png'
  //       })
  //     }).on('click', () => {
  //       console.log('im there');
        
  //       this.openModal();
  //     });
      
  
  //     this.layers.push(customMarker);
  
  //   }
  // }
  


  filterByActivity(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedActivity = target.value;
    this.selectedActivity$.next(target.value);
  }

  async openModal(location: mapDataInterface) {
    const modal = await this.modalCtrl.create({
      component: ModalComponentComponent,
      componentProps: {
        locationData: location
      }
  
    });
    return await modal.present();
  }

  filterByTitle(event: any) {
    const searchTerm = event.detail.value;
    this._locationData$.next(new TitleFilterPipe().transform(this.locationData, searchTerm));
  }
  showMoreActivities() {
    this.showMore = true;
  }

  toggleActivities(event: any) {
    if (event.detail.value === 'activities') {
      this.showMore = false;
    }
  }
  async searchMarker($event: any) {
    const { lat, lng } = $event.latlng;
    const markers: L.Marker[] = await firstValueFrom(this.layers$);
  
    // Initialisez des variables pour suivre le marqueur le plus proche
    let closestMarker : any;
    let closestDistance = Number.POSITIVE_INFINITY;
  
    // Parcourez chaque marqueur et calculez la distance
    markers.forEach((marker: L.Marker) => {
      const position = marker.getLatLng();
      const distance = this.getDistance(lat, lng, position.lat, position.lng);
  
      if (distance < closestDistance) {
        closestDistance = distance;
        closestMarker = marker;
      }
    });
  
    // Vérifiez si un marqueur a été trouvé
    if (closestMarker && closestMarker instanceof L.Marker) {
      const options = closestMarker.options;
      if (options && options.title) {
    
        const location = await this.getLocationDataByTitle(options.title);
  
        if (location) {
          this.openModal(location);
        }
      }
    }
  }
  
  
  getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Utilisez la formule Haversine pour calculer la distance entre deux points géographiques
    const R = 6371; 
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
  
  async getLocationDataByTitle(title: string) {
    const locations = await firstValueFrom(this.locationData$);
    return locations.find((location) => location.title === title);
  }
  
}



