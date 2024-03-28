import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ISearchRequest } from '../../interfaces/isearch-request';
import { SEARCH_ROUTE } from '../../constants/routes';
import { Observable, map, catchError, EMPTY } from 'rxjs';
import { ISearchResult } from '../../interfaces/isearch-result';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private httpClient: HttpClient, 
    private toast: ToastrService
  ) { }

  doSearch(request: ISearchRequest): Observable<ISearchResult[]>{
    const results = this.httpClient.post<ISearchResult[]>(SEARCH_ROUTE, request)
      .pipe( map((response: ISearchResult[]) => {
        return response;
      }), catchError( error => {
        this.toast.error("Error running search. Please try again.")
        return EMPTY; 
      }));

      return results;
  }
}
