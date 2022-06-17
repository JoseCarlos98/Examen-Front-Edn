import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subject, of} from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiBase = environment.baseUrl;

  refresh$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  get refresh(){
    return this.refresh$;
  }

  registro(model: string, body: object) {
    const url = `${this.apiBase}${model}/new`;
    
    return this.http.post(url, body).pipe(
      map((resp:any) => {
        this.refresh$.next();
        resp.ok;
      }),
      catchError(err =>  of(err.error.errors.errors[0].msg))
    );
  }

  getTodos(model: string) {
    const url = `${this.apiBase}${model}`;

    return this.http.get(url)
  }

  editar(model: string, body?: object, idEdit?: any) {
    const url = `${this.apiBase}${model}/${idEdit}`;

    return this.http.put(url, body).pipe(
      map((resp:any) => {
        this.refresh$.next();
        resp.ok;
      }),
      catchError(err =>  of(err.error.errors.errors[0].msg))
    );
  }

  delete(model: string, id: string) {
    const url = `${this.apiBase}${model}/${id}`;

    return this.http.delete(url).pipe(
      tap( _ => this.refresh$.next())
    );
  }
}
