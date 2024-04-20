import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsModule } from '@angular/google-maps';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainLayoutComponent } from './components/common/main-layout/main-layout.component';
import { VendorComponent } from './components/vendor/vendor.component';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './components/common/search/search.component';
import { ResultsComponent } from './components/results/results.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    VendorComponent,
    NotFoundComponent,
    LandingPageComponent,
    ResultsComponent,
    SearchComponent,
    MenuItemComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    GoogleMapsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
