import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, EMPTY } from 'rxjs';
import { SESSION_ROUTE } from '../../constants/routes';
import { ISession } from '../../interfaces/isession';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private httpClient: HttpClient, 
    private deviceDetector: DeviceDetectorService
  ) { }

  createSession(): Observable<ISession>{

    const sessionData: ISession = {
      action: 'create', 
      device: this.deviceDetector.deviceType, 
      browser: this.deviceDetector.browser, 
      os: this.deviceDetector.os
    }

    const session = this.httpClient.post<ISession>(`${SESSION_ROUTE}/create`, sessionData)
      .pipe( map( (session: ISession) => {

        return session;
      }), catchError( error => {

        console.error(error);
        return EMPTY;
      }));

      return session;
  }
  
  terminateSession(session: ISession) {
    console.log(session);
    
    const ended = this.httpClient.post<any>(`${SESSION_ROUTE}/terminate`, session)
    .pipe(map(response => {
      console.log('here');
      console.log(response);
      return '';
    }), catchError(error => {
      console.error(error)
      return [];
    })).subscribe(response => {
      console.log(response);
    });
    
  } 
}


