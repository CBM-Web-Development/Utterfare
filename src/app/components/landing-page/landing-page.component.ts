import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILocation } from '../../lib/interfaces/ilocation';
import { ISearchRequest } from '../../lib/interfaces/isearch-request';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit, OnDestroy{

  constructor(
    private route: Router
  ){}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  search(searchRequest: ISearchRequest){
    console.log(searchRequest);
    this.route.navigate(['search'], {
      queryParams: 
      {
        terms: searchRequest.terms, 
        distance: searchRequest.location.distance, 
        location: JSON.stringify(searchRequest.location)
      }
    });
  }

}
