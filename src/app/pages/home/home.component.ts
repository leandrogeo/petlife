import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { FirestoreService } from 'src/app/services/firestore.service';

declare var google;
interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {




  constructor(public menucontroller: MenuController,
    public firestoreservice: FirestoreService,) { }

  ngOnInit() {
    this.loadMap()
  }


  openMenu() {
    this.menucontroller.toggle('principal');
  }



  map: any;
  directionsDisplay = new google.maps.DirectionsRenderer();
  // parque simon bolivar
  origin = { lat: -1.492898, lng: -78.014910 };
  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.origin,
      zoom: 17
    });

    this.directionsDisplay.setMap(this.map);

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      const marker = {
        position: {
          lat: -1.492898,
          lng: -78.014910,
        },
        title: 'PETLIFE'
      }
      this.addMarker(marker);
    });
  }

  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title
    });
  }

}
