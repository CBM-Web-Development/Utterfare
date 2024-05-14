import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/common/main-layout/main-layout.component';
import { VendorComponent } from './components/vendor/vendor.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ResultsComponent } from './components/results/results.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { MenuItemComponent } from './components/menu-item/menu-item.component';

const routes: Routes = [
  {
    path: '', 
    component: MainLayoutComponent,
    children: [
      {path: '', component: LandingPageComponent},
      {path: 'search', component: ResultsComponent},
      {path: 'login', component: LoginComponent},
      {path: 'sign-up', component: SignUpComponent},
      {path: 'reset-password', component: PasswordResetComponent},
      {path: 'profile/:username', component: ProfileComponent},
      {path: ':vendorSlug', component: VendorComponent},
      {path: ':vendorSlug/:itemSlug', component: MenuItemComponent}
    ]
  },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
