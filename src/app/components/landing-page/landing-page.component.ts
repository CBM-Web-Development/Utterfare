import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILocation } from '../../lib/interfaces/ilocation';
import { ISearchRequest } from '../../lib/interfaces/isearch-request';
import { ISearchResult } from '../../lib/interfaces/isearch-result';
import { SearchService } from '../../services/search/search.service';
import { Subscription, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { locationKey } from '../../lib/stores/Location/location.reducer';
import { locationSelect } from '../../lib/stores/Location/location.selector';
import { getCurrencySymbol } from '../../lib/utils/currency';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, OnDestroy{
  localItems: ISearchResult[] = [];
  newItems: ISearchResult[] = [];
  isLoadingLocal = false; 
  isLoadingLocal$ = new Subscription();
  isLoadingNewItems = false; 
  isLoadingNewItems$ = new Subscription();
  placeholders = [1,2,3,4];
  
  constructor(
    private route: Router,
    private searchService: SearchService,
    private store: Store
  ){}

  ngOnInit(): void {
    this.isLoadingLocal$ = this.searchService.isLoadingLocal$.subscribe( res => {
      this.isLoadingLocal = res;
    });

    this.isLoadingNewItems$ = this.searchService.isLoadingNewItems$.subscribe( res => {
      this.isLoadingNewItems = res;
    });
    this.store.select(locationSelect).subscribe(response => {
      if(response.latitude !== undefined && response.latitude !== null){
        this.searchService.getLocalItems(response.latitude!, response.longitude!).pipe( take(1) ).subscribe( (items: ISearchResult[]) => {
          this.localItems = items.sort(() => Math.random() - 0.5).splice(0, 10);
        });
      }
    });

    this.searchService.getNewItems().pipe( take(1) ).subscribe( res => {
      this.newItems = res.sort(() => Math.random() - 0.5).splice(0, 10);
    })
  }

  search(searchRequest: ISearchRequest){
  
    this.route.navigate(['search'], {
      queryParams: 
      {
        terms: searchRequest.terms, 
        distance: searchRequest.location.distance, 
        location: JSON.stringify(searchRequest.location)
      }
    });
    
  }

  ngOnDestroy(): void {
    this.isLoadingLocal$.unsubscribe();
    this.isLoadingNewItems$.unsubscribe
  }

}

