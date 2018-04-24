import { Directive, Input, Output, OnChanges, OnInit, EventEmitter, ElementRef } from '@angular/core';
import { GoogleMapsAPIWrapper } from '@agm/core';

declare var google: any;
@Directive({
  selector: 'agm-direction'
})
export class AgmDirection implements OnChanges, OnInit {

  @Input() origin: { lat: Number, lng: Number };
  @Input() destination: { lat: Number, lng: Number };
  @Input() travelMode: string = 'DRIVING';
  @Input() transitOptions: any = undefined;
  @Input() drivingOptions: any = undefined;
  @Input() waypoints: object = [];
  @Input() optimizeWaypoints: boolean = true;
  @Input() provideRouteAlternatives: boolean = false;
  @Input() avoidHighways: boolean = false;
  @Input() avoidTolls: boolean = false;
  @Input() renderOptions: any;
  @Input() visible: boolean = true;
  @Input() panel: object | undefined;
  @Input() markerOptions: { origin: any, destination: any } = { origin: undefined, destination: undefined };

  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  public directionsService: any = undefined;
  public directionsDisplay: any = undefined;

  private isFirstChange: boolean = true;

  private originMarker = undefined;
  private destinationMarker = undefined;

  constructor(
    private gmapsApi: GoogleMapsAPIWrapper,
  ) { }

  ngOnInit() {
    this.directionDraw();
  }

  ngOnChanges(obj: any) {
    /**
     * When visible is false then remove the direction layer
     */
    if (!this.visible) {
      try {
        if (typeof this.originMarker !== 'undefined') {
          this.originMarker.setMap(null);
          this.destinationMarker.setMap(null);
        }
        this.directionsDisplay.setPanel(null);
        this.directionsDisplay.setMap(null);
        this.directionsDisplay = undefined;
      } catch (e) { }
    } else {

      if (this.isFirstChange) {
        this.isFirstChange = false;
        return;
      }

      /**
       * When renderOptions are not first change then reset the display
       */
      if (obj.renderOptions) {
        if (obj.renderOptions.firstChange === false) {
          if (typeof this.originMarker !== 'undefined') {
            this.originMarker.setMap(null);
            this.destinationMarker.setMap(null);
          }
          this.directionsDisplay.setPanel(null);
          this.directionsDisplay.setMap(null);
          this.directionsDisplay = undefined;
        }
      }
      this.directionDraw();
    }

  }

  /**
   * This event is fired when the user creating or updating this direction
   */
  private directionDraw() {

    this.gmapsApi.getNativeMap().then(map => {

      if (typeof this.directionsDisplay === 'undefined') {
        this.directionsDisplay = new google.maps.DirectionsRenderer(this.renderOptions);
        this.directionsDisplay.setMap(map);
      }

      if (typeof this.directionsService === 'undefined') {
        this.directionsService = new google.maps.DirectionsService;
      }

      if (typeof this.panel === 'undefined') {
        this.directionsDisplay.setPanel(null);
      } else {
        this.directionsDisplay.setPanel(this.panel);
      }

      this.directionsService.route({
        origin: this.origin,
        destination: this.destination,
        travelMode: this.travelMode,
        transitOptions: this.transitOptions,
        drivingOptions: this.drivingOptions,
        waypoints: this.waypoints,
        optimizeWaypoints: this.optimizeWaypoints,
        provideRouteAlternatives: this.provideRouteAlternatives,
        avoidHighways: this.avoidHighways,
        avoidTolls: this.avoidTolls,
      }, (response: any, status: any) => {
        if (status === 'OK') {
          this.directionsDisplay.setDirections(response);
          /**
           * Emit The DirectionsResult Object
           * https://developers.google.com/maps/documentation/javascript/directions?hl=en#DirectionsResults
           */

          // Replace the default route
          const path = response.routes[0].overview_path
          const routePath = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#6CB0F2',
            strokeOpacity: 0.8,
            strokeWeight: 5,
          });
          routePath.setMap(map);
          google.maps.event.addListener(routePath, 'click', event => {
            this.onClick.emit(event);
          })

          // Custom Markers 
          if (typeof this.markerOptions.origin !== 'undefined') {
            var _route = response.routes[0].legs[0];
            // Origin Marker
            this.markerOptions.origin.map = map;
            this.markerOptions.origin.position = _route.start_location;
            this.originMarker = this.setMarker(map, this.originMarker, this.markerOptions.origin, _route.start_address);
            // Destination Marker
            this.markerOptions.destination.map = map;
            this.markerOptions.destination.position = _route.end_location;
            this.destinationMarker = this.setMarker(map, this.destinationMarker, this.markerOptions.destination, _route.end_address);
          }
          this.onChange.emit(response);
        }
      });
    });
  }

  /**
   * Custom Origin and Destination Icon
   * 
   * @private
   * @param {any} map map
   * @param {any} marker marker
   * @param {any} markerOpts properties
   * @param {string} content marker's infowindow content
   * @returns {any} marker
   * @memberof AgmDirection
   */
  private setMarker(map: any, marker: any, markerOpts: any, content: string) {
    const infowindow = new google.maps.InfoWindow({
      content: content,
    });
    marker = new google.maps.Marker(markerOpts);
    marker.addListener('click', () => {
      infowindow.open(map, marker);
    });
    return marker;
  }
}


