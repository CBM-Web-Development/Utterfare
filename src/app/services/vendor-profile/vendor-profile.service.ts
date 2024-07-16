import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Observable, map, catchError, EMPTY } from "rxjs";
import { VENDOR_PROFILE_ROUTE } from "../../lib/constants/routes";
import { IVendorProfile } from "../../lib/interfaces/ivendor-profile";

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
        /*response.menus?.forEach( (menu, idx) => {
          response.menus![idx].sectionsObj =  menu.sections;
        })*/
       console.log(response);
        return response;
      }), catchError(error => {
        console.log(error);
        this.toastr.error("Error fetching the profile. Please reload the page.")
        
        return EMPTY;
      }));

    return profile;
  }
}
