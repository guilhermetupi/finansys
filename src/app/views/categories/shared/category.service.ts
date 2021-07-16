import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError, mergeMap } from "rxjs/operators";
import { Category } from "./category.model";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private api: string = "api/categories";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Array<Category>> {
    return this.http
      .get(this.api)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategories));
  }

  getById(id: number): Observable<Category> {
    const url: string = `${this.api}/${id}`;
    return this.http
      .get(url)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategory));
  }

  create(category: Category): Observable<Category> {
    return this.http
      .post(this.api, category)
      .pipe(catchError(this.handleError), map(this.jsonDataToCategory));
  }

  update(category: Category): Observable<Category> {
    const url = `${this.api}/${category.id}`;
    return this.http.put(url, category).pipe(
      catchError(this.handleError),
      map(() => category)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.api}/${category.id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  private jsonDataToCategories(json: Array<any>): Array<Category> {
    const categories: Array<Category> = [];
    json.forEach((element) => categories.push(element as Category));
    return categories;
  }

  private jsonDataToCategory(json: any): Category {
    return json as Category;
  }

  private handleError(error: any): Observable<any> {
    console.log("Erro na requisição =>", error);
    return throwError(error);
  }
}
