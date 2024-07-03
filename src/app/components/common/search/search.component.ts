import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ILocation } from '../../../lib/interfaces/ilocation';
import { ISearchRequest } from '../../../lib/interfaces/isearch-request';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { setLocation } from '../../../lib/stores/Location/location.actions';
import { IErrorMessage } from '../../../lib/interfaces/ierror-message';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit{

  @Input() getCurrentLocationOnLoad = false; 
  @Input() isSlim = false; 
  @Input() searchFormTitle = 'Find what you&apos;re craving'
  @Output() search = new EventEmitter<ISearchRequest>();
  @ViewChild('addressText') addressText: any;
  errors: IErrorMessage[] = [];
  isLoadingCurrentLocation = false; 
  locationAutocompleteInput: string = '';
  distances = [1, 5, 10, 25, 50, 100];
  location: ILocation = {}; 
  searchRequest: ISearchRequest = {
    terms: '', 
    location: {
      distance: 5
    }
  };
  classes: string[] = ['search-form'];
  
  searchFormGroup = new FormGroup({
    searchTerms: new FormControl(null, [Validators.required]),
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
    if(this.isSlim && this.classes.indexOf('slim') === -1){
      this.classes.push('search-form__slim');
    }
    if (this.getCurrentLocationOnLoad === true) {
      this.getCurrentLocation();
      this.setMeta()
    }

    this.searchFormGroup.controls.searchTerms.valueChanges.subscribe( val => this.searchRequest.terms = val ?? '');
    this.searchFormGroup.controls.searchLocation.valueChanges.subscribe( val => {
      this.geocodeAddress(val ?? '');
    });
    this.searchFormGroup.controls.searchRadius.valueChanges.subscribe( val => {
      this.searchRequest.location.distance = Number(val) ?? 5;
    });
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

  doSearchEvt(){
    this.search.emit(this.searchRequest);
  }

  geocodeAddress(location: string, lat?: number, lng?: number){
    let geocoder = new google.maps.Geocoder(); 
    geocoder.geocode({address: location}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        let result = results![0];

        if(result != null){
          this.searchRequest.location.latitude = result.geometry.location.lat();
          this.searchRequest.location.longitude = result.geometry.location.lng();
          this.searchRequest.location.formatted = location; 
          this.isLoadingCurrentLocation = false;
          this.location.formatted = result.formatted_address;
          this.errors = this.errors.filter(x => x.field !== 'location');
         }else {
           alert('Unable to find location.');
           this.isLoadingCurrentLocation = false;
           this.searchRequest.location = {};
           let error: IErrorMessage = {
            content: 'Invalid address. Please use a valid address, city & state, or zipcode.', 
            field: 'location', 
           }
           this.errors.push(error);
         }
      }
    });
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
        userLocation.longitude = this.location.longitude;
        this.store.dispatch(setLocation({payload: userLocation}));

        let geocoder = new google.maps.Geocoder();
        let latlng = new google.maps.LatLng(lat, lng);

        geocoder.geocode({location: latlng}, (results, status) => {
          if(status === google.maps.GeocoderStatus.OK){
            let result = results![0];

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
      this.searchRequest.location = this.location = {
        latitude: place.geometry?.location?.lat(),  
        longitude: place.geometry?.location?.lng(), 
        formatted: place.formatted_address
      }
    });
  }
}
