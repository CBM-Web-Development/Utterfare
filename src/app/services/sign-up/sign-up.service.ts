import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, map, catchError, EMPTY } from "rxjs";
import { USER_ROUTE } from "../../lib/constants/routes";
import { IErrorMessage } from "../../lib/interfaces/ierror-message";
import { IUser } from "../../lib/interfaces/iuser";

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
