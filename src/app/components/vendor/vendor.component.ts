import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { IVendorProfile } from '../../lib/interfaces/ivendor-profile';
import { VendorProfileService } from '../../lib/services/vendor-profile/vendor-profile.service';
import { take } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { getCurrencySymbol } from '../../lib/utils/currency';
import { Meta, Title } from '@angular/platform-browser';
import { MenuItemService } from '../../lib/services/MenuItem/menu-item.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})

export class VendorComponent implements OnInit, OnDestroy {
  slug: string = '';
  profile: IVendorProfile = {};
  activeMenuIndex = 0;
  allItems = '';

  constructor(
    private route: ActivatedRoute,
    private vendorProfileService: VendorProfileService,
    private meta: Meta,
    private router: Router,
    private titleService: Title,
    private menuItemService: MenuItemService
  ){}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params['vendorSlug']
    
    this.vendorProfileService.getVendorProfileBySlug(this.slug).pipe( take(1) ).subscribe( response => {
      this.profile = response;
      this.setMeta()
    });
  }
  ngOnDestroy(): void {
  }
  setMeta(){
    this.titleService.setTitle(`${this.profile.vendor?.name} | Utterfare` ?? 'Utterfare')
    this.meta.addTag({name: 'title', content: this.profile.vendor?.name ?? 'Utterfare'});
    this.meta.addTag({name: 'og:url', content: this.router.url});
    this.meta.addTag({name: 'og:type', content: 'website'});
    this.meta.addTag({name: 'og:title', content: this.profile.vendor?.name ?? 'Utterfare'});
    this.meta.addTag({name: 'og:description', content: this.profile.vendor?.description ?? ''});
    this.meta.addTag({name: 'og:image', content: this.profile.vendor?.profilePicture ?? ''});
    this.meta.addTag({name: 'description', content: this.profile.vendor?.description ?? 'Utterfare is the only menu item search engine. Fine the food you want, when you want it!'});
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

  checkOverflow(element: any): boolean{
    return element.offsetHeight > 400;
  }
} 
