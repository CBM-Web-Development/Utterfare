import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, map, catchError, EMPTY } from "rxjs";
import { MENU_ITEM_ROUTE, MENU_ITEM_REVIEWS_ROUTE } from "../../lib/constants/routes";
import { IMenuItem } from "../../lib/interfaces/imenu-item";
import { IVendorItemReview } from "../../lib/interfaces/ivendor-item-review";

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService,
  ) { }

  getVendorMenuItems(vendorSlug: string): Observable<IMenuItem[]>{
    const params = new HttpParams().append("slug", vendorSlug);
    const menuItems = this.httpClient.get<IMenuItem[]>(`${MENU_ITEM_ROUTE}/all`, {params: params})
      .pipe( map((response: IMenuItem[]) => {
        return response
      }), 
      catchError(error => {
        console.error(error);
        return EMPTY;
      }));

    return menuItems;
  }

  getMenuItemBySlug(vendorSlug: string, itemSlug: string): Observable<IMenuItem>{
    const params = new HttpParams()
      .append("vendorSlug", vendorSlug)
      .append("itemSlug", itemSlug);

    const menuItem = this.httpClient.get<IMenuItem>(`${MENU_ITEM_ROUTE}/item/slug`, {params: params})
      .pipe( map((response: IMenuItem) => {

        return response;
      }), catchError(error => {
        this.toastr.error("Error getting the menu item. Please refresh the page")
        return EMPTY; 
      }));

    return menuItem;
  }

  saveReview(review: IVendorItemReview): Observable<IVendorItemReview>{
    const body: any = review;
    body.media = review.tmpMedia?.map(x => x.id);

    
    const reviews = this.httpClient.put<IVendorItemReview>(`${MENU_ITEM_REVIEWS_ROUTE}`, body)
      .pipe( map((response: IVendorItemReview) => {
        return response;
      }), catchError(error => {
        console.error(error);
        this.toastr.error("Error saving review. Please try again.");
        return [];
      }));

    return reviews; 
  }
}
