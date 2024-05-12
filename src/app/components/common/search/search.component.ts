import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ILocation } from '../../../lib/interfaces/ilocation';
import { ISearchRequest } from '../../../lib/interfaces/isearch-request';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { setLocation } from '../../../lib/stores/Location/location.actions';

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

  constructor(
    private titleService: Title,
    private router: Router, 
    private meta: Meta,
    private store: Store
  ){}

  ngOnInit(){
    if (this.getCurrentLocationOnLoad === true) {
      this.getCurrentLocation();
      this.setMeta()
    }
  }

  ngAfterViewInit(): void {
    this.getPlaceAutocomplete();
  }
  setMeta(){
    this.titleService.setTitle('Utterfare')
    this.meta.addTag({name: 'title', content: 'Utterfare - The restaurant menu item search engine.'});
    this.meta.addTag({name: 'og:url', content: this.router.url});
    this.meta.addTag({name: 'og:type', content: 'website'});
    this.meta.addTag({name: 'og:title', content: 'Utterfare - The restaurant menu item search engine.'});
    this.meta.addTag({name: 'og:description', content: 'Utterfare is the only menu item search engine. Fine the food you want, when you want it!'});
    this.meta.addTag({name: 'og:image', content: '/assets/images/Logo.png'});
    this.meta.addTag({name: 'description', content: 'Utterfare is the only menu item search engine. Fine the food you want, when you want it!'});
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
        const userLocation: ILocation = {};
        userLocation.latitude = this.location.latitude; 
        userLocation.longitude = this.location.longitude
        this.store.dispatch(setLocation({payload: userLocation}))

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
