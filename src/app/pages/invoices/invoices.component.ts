import { Component, inject, OnInit, signal } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-invoices',
  imports: [ButtonComponent, RouterLink],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class InvoicesComponent implements OnInit{
  ngOnInit(): void {
    this.getAllInvoice()
  }
  private invoiceService = inject(InvoiceService)
  invoices = signal<any>([])


  getAllInvoice(){
    this.invoiceService.getAllInvoices().subscribe(invoices=>{
      this.invoices.set(invoices)
      console.log(invoices)
    })
  }

}
