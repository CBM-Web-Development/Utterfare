import { HttpClient, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, map, catchError, EMPTY } from "rxjs";
import { USER_ROUTE } from "../../lib/constants/routes";
import { IErrorMessage } from "../../lib/interfaces/ierror-message";


@Injectable({
  providedIn: 'root'
})
export class EditAccountService {
  isLoadingPasswordUpdate$ = new BehaviorSubject<boolean>(false);
  isLoadingAccount$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<IErrorMessage>({});

  constructor(
    private httpClient: HttpClient, 
    private toastr: ToastrService
  ) { }

  updatePassword(username: string, password: string): Observable<boolean>{
    this.isLoadingPasswordUpdate$.next(true);
    const params = new HttpParams()
      .append('username', username)
      .append('password', password);
      
    const update = this.httpClient.put<boolean>(`${USER_ROUTE}/password/update`, {}, {params: params})
      .pipe( map((response: boolean) =>{
        this.isLoadingPasswordUpdate$.next(false);
        return response;
      }), catchError( (error: HttpErrorResponse) => {
        this.error$.next({
          code: error.statusText, 
          content: error.message, 
          field: 'password'
        });

      this.isLoadingPasswordUpdate$.next(false);
        return EMPTY; 
      }));

    return update;
  }

  updateUsername(username: string, id: number): Observable<boolean>{
    this.isLoadingAccount$.next(true);
    const params = new HttpParams()
      .append('username', username)
      .append('userId', id);

      const update = this.httpClient.put<boolean>(`${USER_ROUTE}/update-username`, {}, {params: params})
        .pipe( map( (response: boolean) => {
          this.isLoadingAccount$.next(false);

          return response;
        }), catchError( (error: HttpErrorResponse) => {
          this.error$.next({
            code: error.statusText, 
            content: error.message, 
            field: 'username'
          });
          this.toastr.error('Error updating username');

          this.isLoadingAccount$.next(false);

          return EMPTY;
        }));

      return update; 
  }

  validateUsername(username: string): Observable<boolean> {
    const params = new HttpParams()
      .append('username', username);

    const valid = this.httpClient.post<boolean>(`${USER_ROUTE}/validate/username`, params)
      .pipe( map((res: boolean) => {
        return !res;
      }), catchError( error => {
        console.error(error);
        return EMPTY; 
      } ));

    return valid;
  }
}
