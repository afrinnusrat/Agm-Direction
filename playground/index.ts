/**
 * This is only for local test
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';

@Component({
  selector: 'app',
  template: `
  <h1>Agm-Direction Playground - <a href="https://github.com/explooosion/Agm-Direction" target="_blank">Github</a></h1>
  <button type="button" (click)="getDirection()">Get</button>
  <button type="button" (click)="rmDirection()">Remove</button>
  <agm-map [latitude]="lat" [longitude]="lng">
    <agm-direction *ngIf="dir" [origin]="dir.origin" [destination]="dir.destination" [visible]="visible" [renderOptions]="renderOpts" [markerOptions]="markerOpts"></agm-direction>
  </agm-map>
  `
})
class AppComponent {

  lat: Number = 24.799448;
  lng: Number = 120.979021;
  zoom: Number = 14;

  dir: any = undefined;

  visible: boolean = true;

  renderOpts = {
    suppressMarkers: true,
  };

  markerOpts = {
    origin: {
      icon: 'http://image.ibb.co/bZ3wLn/origin.png',
    },
    destination: {
      icon: 'https://image.ibb.co/cLwp5n/678111_map_marker_256.png',
      label: 'marker label',
      opacity: 0.5,
    },
  };

  getDirection() {
    this.dir = {
      origin: { lat: 24.799448, lng: 120.979221 },
      destination: { lat: 24.799524, lng: 120.975017 },
    }
    this.visible = true;
  }

  rmDirection() {
    this.visible = false;
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
