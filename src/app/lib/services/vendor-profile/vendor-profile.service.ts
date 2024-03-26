import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { IVendorProfile } from '../../interfaces/ivendor-profile';
import { VENDOR_PROFILE_ROUTE } from '../../constants/routes';
import { IVendor } from '../../interfaces/ivendor';

@Injectable({
  providedIn: 'root'
})
export class VendorProfileService {

  constructor(
    private toastr: ToastrService,
    private httpClient: HttpClient
  ) { }

  getVendorProfileBySlug(slug: string): Observable<IVendorProfile> {

    const endpoint = `${VENDOR_PROFILE_ROUTE}/slug/${slug}`;

    const profile = this.httpClient.get<IVendorProfile>(endpoint)
      .pipe( map( (response: IVendorProfile) => {
        response.menus?.forEach( (menu, idx) => {
          response.menus![idx].sectionsObj =  JSON.parse(menu.sections ?? '') ?? [];
        })
        return response;
      }), catchError(error => {
        this.toastr.error("Error fetching the profile. Please reload the page.")
        
        return EMPTY;
      }));

    return profile;
  }
}
