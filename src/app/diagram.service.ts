import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DiagramService {

  constructor(private http: HttpClient) { }

  getDiagram() {
    return this.http.get(`assets/data.csv`, {responseType: 'text'});
  }
}
