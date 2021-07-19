import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  private api = 'api/entries';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Array<Entry>> {
    return this.http.get(this.api).pipe(catchError(this.handleError), map(this.jsonDataToEntries));
  }

  getById(id: number): Observable<Entry> {
    const url = `${this.api}/${id}`;
    return this.http.get(url).pipe(catchError(this.handleError), map(this.jsonDataToEntry));
  }

  create(entry: Entry): Observable<Entry> {
    return this.http.post(this.api, entry).pipe(catchError(this.handleError), map(this.jsonDataToEntry));
  }

  update(entry: Entry): Observable<Entry> {
    const url = `${this.api}/${entry.id}`;
    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.api}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  private jsonDataToEntries(json: Array<any>): Array<Entry> {
    const entries: Array<Entry> = [];
    json.forEach(element => entries.push(Object.assign(new Entry(), element)));
    return entries;
  }

  private jsonDataToEntry(json: any): Entry {
    return json as Entry;
  }

  private handleError(error: any): Observable<any> {
    console.log('Erro na requisição =>', error);
    return throwError(error);
  }
}
