/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';

@Component({
  selector: 'app',
  template: `
  <h1>Agm-Direction Playground - <a href="https://github.com/explooosion/Agm-Direction" target="_blank">Github</a></h1>
  <div class="map">
  <agm-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
    <agm-direction *ngIf="dir" [origin]="dir.origin" [destination]="dir.destination" [renderOptions]="dir.renderOptions" (onClick)="click($event)"></agm-direction>
  </agm-map>
  </div> 
  `
})
class AppComponent {

  lat: Number = 24.799448;
  lng: Number = 120.979021;
  zoom: Number = 15;

  dir = {
    origin: { lat: 24.799448, lng: 120.979021 },
    destination: { lat: 24.799108, lng: 120.970021 },
    renderOptions: {
      suppressPolylines: true,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 5,
    },
    visible: true,
  };

  constructor() { }

  click(event: any) {
    console.info('click', event);
    console.info('x', event.latLng.lat());
    console.info('y', event.latLng.lng());
    console.info('mouse', event.xa);

    this.dir.renderOptions = {
      suppressPolylines: true,
      strokeColor: '#6CB0F2',
      strokeOpacity: 0.8,
      strokeWeight: 5,
    }
    this.dir.visible = false;
    this.dir.visible = true;
  }

}

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AgmCoreModule.forRoot({ // @agm/core
      apiKey: '',
    }),
    AgmDirectionModule
  ]
})
class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
