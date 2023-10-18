import { Component } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular'; // Importez NavParams
import { mapDataInterface } from 'src/app/DatasInterface';

@Component({
  selector: 'app-modal-component',
  templateUrl: './modal-component.component.html',
  styleUrls: ['./modal-component.component.scss']
})
export class ModalComponentComponent {
  locationData: mapDataInterface; 

  constructor(
    public readonly modalCtrl: ModalController,
    public readonly navParams: NavParams // Injectez NavParams
  ) {
    this.locationData = this.navParams.get('locationData'); // Récupérez les données depuis NavParams
  }
}
