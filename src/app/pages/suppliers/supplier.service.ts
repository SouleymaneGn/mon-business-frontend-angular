import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  http = inject(HttpClient)
  baseUrl = "http://localhost:3000"
  saveCustomer(customer: any) {
  return this.http.post<any>(this.baseUrl+"/suppliers",customer)
  }
  
  getAllSuppliers(){
     return this.http.get<any>(this.baseUrl+"/suppliers")
 
  }
}
