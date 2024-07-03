import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, EMPTY, map, Observable } from 'rxjs';
import { MEDIA_ROUTE, PROFILE_ROUTE } from '../../constants/routes';
import { IMedia } from '../../interfaces/imedia';
import { IErrorMessage } from '../../interfaces/ierror-message';
import { IProfile } from '../../interfaces/iprofile';

@Injectable({
  providedIn: 'root'
})
export class EditProfileService {

  isLoadingProfilePicture$ = new BehaviorSubject<boolean>(false);
  errors$ = new BehaviorSubject<IErrorMessage>({});
  
  constructor(
    private toastr: ToastrService, 
    private httpClient: HttpClient
  ) { }

  uploadProfilePicture(userId: number, file: File): Observable<IMedia>{
    this.isLoadingProfilePicture$.next(true);

    let formData = new FormData()
    formData.append('file', file);

    const params = new HttpParams()
      .append('userId', userId);

      const fileUrl = this.httpClient.put<IMedia>(`${MEDIA_ROUTE}/upload/single`, formData, {params})
        .pipe( map((response: IMedia) => {
          this.isLoadingProfilePicture$.next(false);
          
          return response;
        }), catchError( (error: HttpErrorResponse) => {
          this.isLoadingProfilePicture$.next(false);
          
          this.errors$.next({
            field: 'profile-picture', 
            content: error.message, 
            code: error.statusText
          });
          console.error(error);
          return EMPTY;
        }));

      return fileUrl;
  }

  saveProfileChanges(profile: IProfile): Observable<IProfile>{
      const savedProfile = this.httpClient.post<IProfile>(`${PROFILE_ROUTE}/save`, profile)
        .pipe( map((response: IProfile) => {
          this.toastr.success("Changes saved");
          return response; 
        }), catchError( (error: HttpErrorResponse) => {
          this.errors$.next({code: error.statusText, content: error.message});
          console.error(error);
          this.toastr.error("Failed to save profile changes");
          return EMPTY; 
        }));

      return savedProfile;
  }


}
