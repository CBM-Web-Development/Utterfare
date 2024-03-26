import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { IVendorProfile } from '../../lib/interfaces/ivendor-profile';
import { VendorProfileService } from '../../lib/services/vendor-profile/vendor-profile.service';
import { take } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { getCurrencySymbol } from '../../lib/utils/currency';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})

export class VendorComponent implements OnInit, OnDestroy {
  slug: string = '';
  profile: IVendorProfile = {};
  activeMenuIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private vendorProfileService: VendorProfileService,
  ){}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params['vendorSlug']
    this.vendorProfileService.getVendorProfileBySlug(this.slug).pipe( take(1) ).subscribe( response => {
      this.profile = response;
      console.log(this.profile);
    });
  }
  ngOnDestroy(): void {
  }

  scrollToSection(section: HTMLElement){
    section.scrollIntoView({ behavior: 'smooth', block: 'start'});
  }

  getItemTitle(itemId: number): string {
    
    return this.profile.menuItems?.filter(x => x.id === itemId)[0].itemName ?? '';
  }

  getItemDescription(itemId: number): string {
    return this.profile.menuItems?.filter(x => x.id === itemId)[0].itemDescription ?? '';
  }

  getItemPrice(itemId: number): string {
    const menuItem = this.profile.menuItems?.filter( x => x.id === itemId)[0];

    const currency = menuItem?.currency ?? '';
    const price = menuItem?.price;

    return `${getCurrencySymbol(currency)}${price?.toFixed(2) ?? ''}`;
  }
}
