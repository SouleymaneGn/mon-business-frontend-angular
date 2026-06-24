import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  http = inject(HttpClient)
  baseUrl = "http://localhost:3000"
  savePurchases(purchases: any) {
  return this.http.post<any>(this.baseUrl+"/purchase",purchases)
  }
  
  getAllPurchases(){
     return this.http.get<any>(this.baseUrl+"/purchase")
 
  }  
}
