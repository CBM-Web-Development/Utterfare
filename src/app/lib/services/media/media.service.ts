import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IMedia } from '../../interfaces/imedia';
import { MEDIA_ROUTE } from '../../constants/routes';
import { BehaviorSubject, catchError, EMPTY, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService
  ) { }

  uploadMediaFiles(files: File[], userId: number): Observable<IMedia[]>{
    this.isLoading$.next(true);

    const body = new FormData()
    files.forEach(file => {
      body.append('files', file);
    });

    const params = new HttpParams()
      .append('userId', userId); 

    const uploadedFiles = this.httpClient.put<IMedia[]>(`${MEDIA_ROUTE}/upload/multiple`, body, {params: params} )
      .pipe( map( (response: IMedia[]) => {
        this.isLoading$.next(false);
        return response;
      }), catchError(error => {
        this.isLoading$.next(false);
        this.toastr.error("Error uploading file(s). Please try again.")
        return EMPTY;
      }));

    return uploadedFiles;

  }

  getMediaSource(id: number): Observable<string> {

    const params = new HttpParams()
      .append('id', id);

    const src = this.httpClient.get<IMedia>(`${MEDIA_ROUTE}`, {params: params})
      .pipe( map((response: IMedia) => {
        return response.url ?? '';
      }), catchError(error => {
        return EMPTY;
      }));

      return src;
  }

  removeMediaFile(id: number): Observable<boolean>{
    this.isLoading$.next(true);

    const params = new HttpParams()
      .append('mediaId', id);
    const didDelete = this.httpClient.delete<boolean>(`${MEDIA_ROUTE}`, {params: params} )
      .pipe( map( response => {
        this.isLoading$.next(false);
        return true; 
      }), catchError(error => {
        this.isLoading$.next(false);
        this.toastr.error("Error deleting the media item. Try again.")
        return EMPTY;
      }));

    return didDelete
  }
}
