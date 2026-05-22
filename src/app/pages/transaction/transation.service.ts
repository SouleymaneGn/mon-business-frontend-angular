import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface Transaction {
  id: string
  string: string
  clientId: string
  amount: number,
  note: string,
  createdAt: Date
  "updatedAt": Date
}
@Injectable({
  providedIn: 'root',
})
export class TransationService {
  http = inject(HttpClient)
  baseUrl = "http://localhost:3000/"
  
  getAllTransaction(){
    return this.http.get<Transaction>(this.baseUrl+"transaction")
  }

 
}
