import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/common/main-layout/main-layout.component';
import { VendorComponent } from './components/vendor/vendor.component';
import { NotFoundComponent } from './components/common/not-found/not-found.component';

const routes: Routes = [
  {
    path: '', 
    component: MainLayoutComponent,
    children: [
      {path: ':vendorSlug', component: VendorComponent}
    ]
  },
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
