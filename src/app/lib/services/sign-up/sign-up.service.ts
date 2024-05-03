import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, map, Observable } from 'rxjs';
import { IErrorMessage } from '../../interfaces/ierror-message';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../interfaces/iuser';
import { USER_ROUTE } from '../../constants/routes';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  isLoading$ = new BehaviorSubject<boolean>(false);
  errorMsg$ = new BehaviorSubject<IErrorMessage>({});
  
  constructor(
    private httpClient: HttpClient, 
    private toast: ToastrService,
  ) { }

  signUp(user: IUser): Observable<IUser>{
    this.isLoading$.next(true);

    const data = {
      username: user.username, 
      emailAddress: user.contactDetails?.emailAddress, 
      password: user.password, 
      phoneNumber: user.contactDetails?.phoneNumber
    }

    const newUser = this.httpClient.put<IUser>(`${USER_ROUTE}/sign-up`, data)
      .pipe( map((response: IUser) => {

        this.isLoading$.next(false);
        console.log(response);
        return response;
      }), catchError(error => {
        console.error(error);
        this.isLoading$.next(false);
        if(error.status === 400){
          const ufError: IErrorMessage = error.error[0];
          this.errorMsg$.next(ufError);
        }

        return EMPTY;
      }));

    return newUser;
  }
}
