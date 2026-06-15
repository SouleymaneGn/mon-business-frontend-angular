import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { InvoiceService } from '../invoice.service';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';
import { SelectComponent } from '../../shared/components/form/select/select.component';
import { CustomerService } from '../customer/customer.service';
import { ProductsService } from '../products/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-invoice',
  standalone: true,
  imports: [
    CommonModule,
    LabelComponent,
    InputFieldComponent,
    SelectComponent
  ],
  templateUrl: './create-invoice.component.html',
  styleUrl: './create-invoice.component.css'
})
export class CreateInvoiceComponent implements OnInit {
  router = inject(Router)

  private invoiceService = inject(InvoiceService);
   customerService = inject(CustomerService)
  private productService = inject(ProductsService)

  ngOnInit(): void {
    // charger clients
    this.getAllCustomer()
    // charger produits
    this.getAllProducts()
  }

  invoice = signal({
    customerId: '',
    items: [] as {
      productId: string;
      quantity: number;
    }[]
  });

  price = signal<number>(1)

  customers = signal<any[]>([]);
  products = signal<any[]>([]);

  selectedCustomerId = signal('');
  
  selectedProductId = signal('');
  quantity = signal(1);

  customerOptions = computed(() =>
    this.customers().map(customer => ({
      value: customer.id,
      label: customer.name
    }))
  );

  productOptions = computed(() =>
    this.products().map(product => ({
      value: product.id,
      label: `${product.name} (${product.stock})`
    }))
  );

  handleCustomerChange(customerId: string) {
    this.selectedCustomerId.set(customerId);

    this.invoice.update(invoice => ({
      ...invoice,
      customerId
    }));
  }

 handleProductChange(productId: string) {

  this.selectedProductId.set(productId);

  const product = this.products().find(
    p => p.id === productId
  );

  if (product) {
    this.price.set(product.price);
  }
}

  addItem() {

    if (!this.selectedProductId()) {
      return;
    }

    this.invoice.update(invoice => ({
      ...invoice,
      items: [
        ...invoice.items,
        {
          productId: this.selectedProductId(),
          quantity: this.quantity()
        }
      ]
    }));

    this.selectedProductId.set('');
    this.quantity.set(1);
  }

  removeItem(index: number) {
    this.invoice.update(invoice => ({
      ...invoice,
      items: invoice.items.filter((_, i) => i !== index)
    }));
  }

 
  getAllCustomer(){
      this.customerService.getAllCustomers().subscribe(customers=>{
        this.customers.set(customers)
        console.log(customers)
      })
   }
  getAllProducts(){
      this.productService.getAllProducts().subscribe(products=>{
        this.products.set(products)
        console.log(products)
      })
   } 

  createInvoice() {

    this.invoiceService
      .createInvoice(this.invoice())
      .subscribe({
        next: response => {
          console.log(response);

          this.invoice.set({
            customerId: '',
            items: []
          });

          this.selectedCustomerId.set('');
          this.selectedProductId.set('');
          this.quantity.set(1);
          this.router.navigate(["invoices"])
        },
        error: err => console.error(err)
      });
  }
}