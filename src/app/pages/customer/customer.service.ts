import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  http = inject(HttpClient)
  baseUrl = "http://localhost:3000"

  getAllCustomers(){
    return this.http.get(this.baseUrl+"/customers")
  }
  saveCustomer(customer:{name:string, phone:string}){
   return this.http.post(this.baseUrl+"/customers",customer)
  }
  
}
