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
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './components/common/search/search.component';
import { ResultsComponent } from './components/results/results.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { LoadingIndicatorComponent } from './components/common/loading-indicator/loading-indicator.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';
import { ReviewComponent } from './components/common/review/review.component';
import { StoreModule } from '@ngrx/store';
import { userAuthKey, userAuthReducer } from './lib/stores/UserAuth/userauth.reducer';
import { locationKey, locationReducer } from './lib/stores/Location/location.reducer';
import { ItemCardComponent } from './components/common/item-card/item-card.component';
import { authInterceptor } from './lib/interceptors/auth.interceptor';
import { FeedItemComponent } from './components/common/feed-item/feed-item.component';
import { ConnectionsComponent } from './components/connections/connections.component';
import { EditAccountComponent } from './components/edit-account/edit-account.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    VendorComponent,
    NotFoundComponent,
    LandingPageComponent,
    ResultsComponent,
    SearchComponent,
    ProfileComponent,
    LoginComponent,
    PasswordResetComponent,
    SignUpComponent,
    LoadingIndicatorComponent,
    MenuItemComponent,
    ReviewComponent,
    ItemCardComponent,
    FeedItemComponent,
    ConnectionsComponent,
    EditAccountComponent,
    EditProfileComponent
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
    ToastrModule.forRoot(),
    StoreModule.forRoot(),
    StoreModule.forFeature(locationKey, locationReducer),
    StoreModule.forFeature(userAuthKey, userAuthReducer)
  ],
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
