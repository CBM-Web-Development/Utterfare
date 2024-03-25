import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/common/main-layout/main-layout.component';
import { VendorComponent } from './components/vendor/vendor.component';

const routes: Routes = [
  {
    path: '', 
    component: MainLayoutComponent,
    children: [
      {path: ':vendor', component: VendorComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
