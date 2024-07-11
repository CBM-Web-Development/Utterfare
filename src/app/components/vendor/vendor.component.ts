import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IVendorProfile } from '../../lib/interfaces/ivendor-profile';
import { VendorProfileService } from '../../lib/services/vendor-profile/vendor-profile.service';
import { take } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { getCurrencySymbol } from '../../lib/utils/currency';
import { Meta, Title } from '@angular/platform-browser';
import { MenuItemService } from '../../lib/services/menu-item/menu-item.service';
import { IMenuItem } from '../../lib/interfaces/imenu-item';
import { IVendorItem } from '../../lib/interfaces/ivendor-item';
import { IMenu } from '../../lib/interfaces/imenu';
import { IVendor } from '../../lib/interfaces/ivendor';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})

export class VendorComponent implements OnInit, OnDestroy, AfterViewInit {
  slug: string = '';
  profile: IVendorProfile = {};
  activeMenuIndex = 0;
  allItems = '';
  menuHeight = '400px';
  showOverflowToggle = false;
  background='#ffffff'

  @ViewChild('menus') menus?: ElementRef;

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
      this.checkOverflow();
      this.setMeta()
    });
  }
  ngAfterViewInit(): void {
    
    this.menus!.nativeElement;
    
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
    return this.profile.menuItems?.find(x => x.id == itemId)?.itemName ?? '';
  }

  getItemDescription(itemId: number): string {
    return this.profile.menuItems?.find(x => x.id == itemId)?.itemDescription ?? '';
  }

  getItemPrice(itemId: number): string {
    const menuItem = this.profile.menuItems?.filter( x => x.id === itemId)[0];

    const currency = menuItem?.currency ?? '';
    const price = menuItem?.price;

    return `${getCurrencySymbol(currency)}${price?.toFixed(2) ?? ''}`;
  }

  checkOverflow(){
    const element = this.menus!.nativeElement;
    console.log(element.parentNode.offsetHeight);
    this.showOverflowToggle = element.parentNode.offsetHeight > 400;
  }

  toggleMenuExpand(){
    this.menuHeight = this.menuHeight === '400px' ? 'auto' : '400px';
  }

  navigateToItem(itemId: number){
    const selectedItem: IVendorItem = this.profile.menuItems?.find(x => x.id === itemId)!;
    this.router.navigate([selectedItem.slug], {relativeTo: this.route})
  }
  ngOnDestroy(): void {
  }
} 
