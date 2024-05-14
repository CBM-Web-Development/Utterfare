import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, EMPTY, map, Observable } from 'rxjs';
import { IErrorMessage } from '../../interfaces/ierror-message';
import { IProfile } from '../../interfaces/iprofile';
import { IVendorItemReview } from '../../interfaces/ivendor-item-review';
import { FEED_ROUTE, PROFILE_ROUTE } from '../../constants/routes';
import { IFeedItem } from '../../interfaces/ifeed-item';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  isLoadingProfile$ = new BehaviorSubject<boolean>(false);
  isLoadingReviews$ = new BehaviorSubject<boolean>(false);
  error = new BehaviorSubject<IErrorMessage>({});

  constructor(
    private httpClient: HttpClient, 
    private toastr: ToastrService
  ) { }

  getProfile(username: string): Observable<IProfile>{
    this.isLoadingProfile$.next(true);

    const params = new HttpParams()
      .append('username', username);
    const profile = this.httpClient.post<IProfile>( `${PROFILE_ROUTE}`, params )
      .pipe( map((response: IProfile) => {
        this.isLoadingProfile$.next(false);
        return response;
      }), catchError( error => {
        console.error(error);
        this.toastr.error("Failed to load user profile.")
        return EMPTY; 
      }));

    return profile;
  }

  getReviews(profileId: number): Observable<IFeedItem[]>{
    this.isLoadingReviews$.next(true);

    const params = new HttpParams()
      .append('profileId', profileId);

    const reviews = this.httpClient.get<IFeedItem[]>(`${FEED_ROUTE}`, {params: params})
      .pipe( map((response: IFeedItem[]) => {
        this.isLoadingReviews$.next(false);
        return response; 
      }), catchError( error => {
        this.isLoadingReviews$.next(false);
        this.error.next({code: 'reviews', content: 'Error loading reviews.'});
        return EMPTY;
      } ));

    return reviews;
  }

}
