import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISearchRequest } from '../../lib/interfaces/isearch-request';
import { SearchService } from '../../lib/services/search/search.service';
import { ISearchResult } from '../../lib/interfaces/isearch-result';
import { take } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  allResults: ISearchResult[] = [];
  filteredResults: ISearchResult[] = [];
  perPage = 10;
  start = 0; 
  end = this.perPage;
  maxPages = 1;
  activePage = 1;

  resultsFilterFormGroup = new FormGroup({
    sortBy: new FormControl('match')
  })
  
  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService,
  ){}

  ngOnInit(): void {
    this.resultsFilterFormGroup.controls.sortBy.valueChanges.subscribe( val => this.sortItems(val!));
    const params = this.activatedRoute.snapshot.queryParams;
    if(params){
      const location = JSON.parse(params['location']);
      const searchParams: ISearchRequest = {
        terms: params['terms'], 
        location: {
          latitude: location.latitude, 
          longitude: location.longitude,
          distance: location.distance
        }
      };

      this.doSearch(searchParams);
    }
  }

  pages(int: number): number[]{
    return Array(int);
  }

  doSearch(params: ISearchRequest){

    this.searchService.doSearch(params).pipe( take(1) ).subscribe( response => {
      this.filteredResults = this.allResults = response.sort((a, b) => {return a.rank - b.rank});
      this.maxPages = Math.ceil(this.allResults.length / this.perPage);
      console.log(this.maxPages);
    });
  }

  sortItems(sortBy: string){
    switch(sortBy){
      case 'match':
        this.filteredResults.sort((a, b) => {return a.rank - b.rank});
        break;
      case 'asc': 
        this.filteredResults.sort((a, b) => {return a.distance - b.distance});
        break;
      case 'desc': 
        this.filteredResults.sort((a,b) => {return b.distance - a.distance});
        break;
      default: break;
    }
  }

  goToPage(page: number){
    this.activePage = page;
    this.start = (this.activePage - 1) * this.perPage;
    this.end = this.start + this.perPage;
  }

  goToVendor(slug: string){
    console.log(slug);
    this.router.navigate([slug]);
  }

  search(request: ISearchRequest){
    console.log(request);
  }

}
