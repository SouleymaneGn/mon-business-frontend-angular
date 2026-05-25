import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class TransationService {
  http = inject(HttpClient)
  baseUrl = "http://localhost:3000/"
  
  getAllTransaction(){
    return this.http.get(this.baseUrl+"transaction")
  }

  addTransaction(transaction:{
    type: string
    clientId: string
    amount: number,
    note: string,
  }){
  return this.http.post(this.baseUrl+'transaction',transaction)
  }

 
}
