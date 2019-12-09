import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getGlobalOB() {
    return this.http.get("http://127.0.0.1:5555/order_book?ex=GLOBAL")
  }
}
