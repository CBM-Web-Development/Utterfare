import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { IMenuItem } from '../../interfaces/imenu-item';
import { MENU_ITEM_ROUTE } from '../../constants/routes';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getVendorMenuItems(vendorSlug: string): Observable<IMenuItem[]>{
    const params = new HttpParams().append("slug", vendorSlug);
    const menuItems = this.httpClient.get<IMenuItem[]>(`${MENU_ITEM_ROUTE}/all`, {params: params})
      .pipe( map((response: IMenuItem[]) => {
        return response
      }), 
      catchError(error => {
        console.error(error);
        return [];
      }));

    return menuItems;
  }
}
