import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ILocation } from '../../../lib/interfaces/ilocation';
import { ISearchRequest } from '../../../lib/interfaces/isearch-request';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit{

  @Input() getCurrentLocationOnLoad = false; 
  @Output() submit = new EventEmitter<ISearchRequest>();
  @ViewChild('addressText') addressText: any;

  isLoadingCurrentLocation = false; 
  locationAutocompleteInput: string = '';
  distances = [1, 5, 10, 25, 50, 100];
  location: ILocation = {}; 
  
  searchFormGroup = new FormGroup({
    searchTerms: new FormControl('', [Validators.required]),
    searchLocation: new FormControl('', [Validators.required]), 
    searchRadius: new FormControl(5, [Validators.required])
  });

  constructor(){}

  ngOnInit(){
    if (this.getCurrentLocationOnLoad === true) {
      this.getCurrentLocation();
    }
  }

  ngAfterViewInit(): void {
    this.getPlaceAutocomplete();
  }

  search(){
    const terms = this.searchFormGroup.controls.searchTerms.value ?? '';
    const distance = this.searchFormGroup.controls.searchRadius.value ?? 0.0;
    const searchRequest: ISearchRequest = {
      terms: terms, 
      location: this.location
    }
    this.submit.emit(searchRequest);
  }

  getCurrentLocation(){
    if(navigator.geolocation){
      this.isLoadingCurrentLocation = true;
      navigator.geolocation.getCurrentPosition( position => {
        const lat = position.coords.latitude; 
        const lng = position.coords.longitude;
        this.location.latitude = lat; 
        this.location.longitude = lng; 

        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({location: latlng}, (results, status) => {
          if(status === google.maps.GeocoderStatus.OK){
            let result = results![0];
            let address = result.address_components;
            if(result != null){
             this.searchFormGroup.controls.searchLocation.setValue(result.formatted_address);
             this.isLoadingCurrentLocation = false;
             this.location.formatted = result.formatted_address;
            }else {
              alert('Unable to find location.');
              this.isLoadingCurrentLocation = false;
            }
          }
        });

      });
    }else {
      alert('Geolocation is not supported by this browser');
      this.isLoadingCurrentLocation = false;
    }
  }
  

  private getPlaceAutocomplete(){
    const autocomplete = new google.maps.places.Autocomplete(this.addressText.nativeElement, {
      componentRestrictions: {country: 'US'},
      types: ['street_address', 'locality', 'postal_code']
    });

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      console.log("Place");
      console.log(place);
      this.location = {
        latitude: place.geometry?.location?.lat(),  
        longitude: place.geometry?.location?.lng(), 
        formatted: place.formatted_address
      }
    });
  }
}
