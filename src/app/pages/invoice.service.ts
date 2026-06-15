import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  http = inject(HttpClient)
  baseUrl ="http://localhost:3000"
  
  createInvoice(invoice:any){
  return this.http.post(this.baseUrl+"/invoices",invoice)
}

invoicePayment(payload:any){
  return this.http.post<any>(this.baseUrl+"/payments",payload)
}
getAllInvoices(){
  return this.http.get(this.baseUrl+"/invoices").pipe(
  )
}
}
