import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable, map, catchError, EMPTY } from "rxjs";
import { SEARCH_ROUTE } from "../../lib/constants/routes";
import { ISearchRequest } from "../../lib/interfaces/isearch-request";
import { ISearchResult } from "../../lib/interfaces/isearch-result";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  isLoadingLocal$ = new BehaviorSubject<boolean>(true);
  isLoadingSearch$ = new BehaviorSubject<boolean>(false);
  isLoadingNewItems$ = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient, 
    private toast: ToastrService,
  ) { }

  doSearch(request: ISearchRequest): Observable<ISearchResult[]>{
    const results = this.httpClient.post<ISearchResult[]>(SEARCH_ROUTE, request)
      .pipe( map((response: ISearchResult[]) => {

        return response;
      }), catchError( error => {
        console.error(error);
        this.toast.error("Error running search. Please try again.")
        return EMPTY; 
      }));

      return results;
  }

  getLocalItems(latitude: number, longitude: number): Observable<ISearchResult[]>{
    this.isLoadingLocal$.next(true);

    const params = new HttpParams()
      .append('latitude', latitude)
      .append('longitude', longitude);

    const results = this.httpClient.get<ISearchResult[]>(`${SEARCH_ROUTE}/local`, {params: params})
      .pipe( map((response: ISearchResult[]) => {
        this.isLoadingLocal$.next(false);

        return response;
      }), catchError( error => {
        this.isLoadingLocal$.next(false);
        console.error(error);

        return EMPTY;
      }));

    return results;
  }

  getNewItems(): Observable<ISearchResult[]>{
    this.isLoadingNewItems$.next(true);

    const newItems = this.httpClient.get<ISearchResult[]>(`${SEARCH_ROUTE}/new-items`)
      .pipe( map((response: ISearchResult[]) => {
        this.isLoadingNewItems$.next(false);

        return response;
      }), catchError(error => {
        this.isLoadingNewItems$.next(false);
        console.error(error);
        return EMPTY; 
      }));

    return newItems;
  }
}
