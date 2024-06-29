import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, EMPTY, map, Observable } from 'rxjs';
import { IErrorMessage } from '../../interfaces/ierror-message';
import { IProfile } from '../../interfaces/iprofile';
import { IVendorItemReview } from '../../interfaces/ivendor-item-review';
import { FEED_ROUTE, FOLLOWERS_ROUTE, PROFILE_ROUTE } from '../../constants/routes';
import { IFeedItem } from '../../interfaces/ifeed-item';
import { IProfileConnectionResponse } from '../../interfaces/iprofile-connection-response';
import { IProfileConnection } from '../../interfaces/iprofile-connection';

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

  follow(profileId: number, followerProfileId: number): Observable<IProfileConnection>{

    const params = new HttpParams() 
      .append('profileId', profileId)
      .append('followerProfileId', followerProfileId);


      
    const follow = this.httpClient.put<IProfileConnection>(`${FOLLOWERS_ROUTE}/follow`, params)
      .pipe( map((response: IProfileConnection) => {
        return response;
      }), catchError( error => {
        console.error(error);
        return EMPTY; 
      }));

    return follow;
  }

  unfollow(profileId: number, followerProfileId: number): Observable<boolean>{
    const params = new HttpParams() 
      .append('profileId', profileId)
      .append('followerProfileId', followerProfileId);

    const unfollow = this.httpClient.delete<boolean>(`${FOLLOWERS_ROUTE}/unfollow`, {params: params})
      .pipe( map((response: boolean) => {
        return response;
      }), catchError( error => {
        console.error(error);
        return EMPTY; 
      }));

    return unfollow;
  }

  getFollowing(profileId: number): Observable<IProfileConnectionResponse[]>{
    const params = new HttpParams() 
      .append('profileId', profileId);

    const following = this.httpClient.get<IProfileConnectionResponse[]>(`${FOLLOWERS_ROUTE}/following`, {params: params})
      .pipe( map((response: IProfileConnectionResponse[]) => {

        return response;
      }), catchError( error => {
        console.error(error);
        return EMPTY; 
      }));

    return following;
  }

  getFollowers(profileId: number): Observable<IProfileConnectionResponse[]>{
    const params = new HttpParams() 
      .append('profileId', profileId);

    const followers = this.httpClient.get<IProfileConnectionResponse[]>(`${FOLLOWERS_ROUTE}`, {params: params})
      .pipe( map((response: IProfileConnectionResponse[]) => {

        return response;
      }), catchError( error => {
        console.error(error);
        return EMPTY; 
      }));

    return followers;
  }

}
