import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, map, Observable } from 'rxjs';
import { IUser } from '../../interfaces/iuser';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { IErrorMessage } from '../../interfaces/ierror-message';
import { USER_ROUTE } from '../../constants/routes';
import { IAuthUser } from '../../interfaces/iauth-user';
import { IAuthentication } from '../../interfaces/iauthentication';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  errorMsg$ = new BehaviorSubject<IErrorMessage[]>([]);
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient, 
    private toastr: ToastrService
  ) { }

  passwordResetCodeValidation(username: string, resetCode: number): Observable<boolean>{
    this.isLoading$.next(true);

    const body: IUser = {username, resetCode};

    const valid = this.httpClient.post<boolean>(`${USER_ROUTE}/password-reset/validate`, body).pipe(map((response) => {
      return response != null; 
    }), catchError(error => {
      this.toastr.error("Error validating reset code");
      console.error(error);
      return [];
    }));

    this.isLoading$.next(false);

    return valid;
  }

  passwordResetRequest(username: string): Observable<boolean>{
    this.isLoading$.next(true);
    const params = new HttpParams()
      .append('username', username);

    const request = this.httpClient.post<boolean>(`${USER_ROUTE}/password-reset/request`, params)
      .pipe( map( (response: boolean) => {
        this.isLoading$.next(false);
        return response;
      }), catchError( error => {
        this.isLoading$.next(false);
        console.error(error);
        this.errorMsg$.next(error);
        this.toastr.error("Error submitting request. Please try again");
        return EMPTY;
      }));

    return request;
  }

  passwordReset(user: IUser): Observable<boolean>{
    const success = this.httpClient.post<boolean>(`${USER_ROUTE}/password-reset/set-password`, user)
      .pipe( map((response: boolean) => {
        console.log(response);
        return response;
      }), catchError(error => {
        console.error(error);
        this.toastr.error("Error resetting password. Please try again.")
        return EMPTY;
      }));

      return success;
  }

  authenticate(user: IUser): Observable<IAuthUser>{
    this.isLoading$.next(true);

    const authUser = this.httpClient.post<IAuthUser>(`${USER_ROUTE}/authenticate/user`, user)
      .pipe( map((response: IAuthUser) => {
        this.isLoading$.next(false);
        const authUser: IAuthUser = {
          auth: response.auth, 
          profile: response.profile
        }

        return authUser;
      }), catchError( error => {
        this.isLoading$.next(false);
        if(error.status === 400){
          const errors: IErrorMessage[] = error.error; 
          this.errorMsg$.next(errors);
        }
        this.toastr.error("Error signing in. Please try again.");
        return EMPTY;
      }));

    return authUser;
  }

  validateToken(user: IAuthentication): Observable<boolean>{
    const validated = this.httpClient.post<boolean>(`${USER_ROUTE}/validate`, user)
      .pipe( map((response: boolean) => {
        return response;
      }), catchError(error => {
        return EMPTY; 
      }));

    return validated;
  }
}
