import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/common/main-layout/main-layout.component';
import { VendorComponent } from './components/vendor/vendor.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ResultsComponent } from './components/results/results.component';
import { SessionService } from './lib/services/session/session.service';
import { take } from 'rxjs';

const routes: Routes = [
  {
    path: '', 
    component: MainLayoutComponent,
    children: [
      {path: '', component: LandingPageComponent},
      {path: 'search', component: ResultsComponent},
      {path: ':vendorSlug', component: VendorComponent}
    ]
  },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule implements OnInit { 

  constructor(
    private sessionService: SessionService
  ){

    if(localStorage.getItem('sessionId') === undefined || localStorage.getItem('sessionId') === null){
      this.sessionService.createSession().pipe( take(1) ).subscribe ( response => {
        localStorage.setItem('session', JSON.stringify(response));
        localStorage.setItem('sessionId', response.sessionId);
      });
    }
  }

  ngOnInit(): void {
    
  }
}
