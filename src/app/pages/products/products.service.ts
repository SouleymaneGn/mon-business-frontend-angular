import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  http = inject(HttpClient)
  baseUrl = "http://localhost:3000"

  getAllProducts(){
    return this.http.get<any[]>(this.baseUrl+"/produts")
  }
  saveCustomer(product:{name:string, price:number, stock :number}){
   return this.http.post(this.baseUrl+"/produts",product)
  }
}
