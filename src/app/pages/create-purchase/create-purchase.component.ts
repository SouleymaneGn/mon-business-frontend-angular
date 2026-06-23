import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-purchase',
  imports: [],
  templateUrl: './create-purchase.component.html',
  styleUrl: './create-purchase.component.css',
})
export class CreatePurchaseComponent {
    router = inject(Router)

 ngOnInit(): void {
    // charger clients
    this.getAllCustomer()
    // charger produits
    this.getAllProducts()
  }
suppliers = signal<any>([])
 purchase = signal({
    supplierId: '',
    paidAmount: 0,
    items: [] as {
      productId: string;
      price:number
      purchasePrice: number;
    }[]
  });

  price = signal<number>(1)

  customers = signal<any[]>([]);
  products = signal<any[]>([]);

  selectedCustomerId = signal('');
  
  selectedProductId = signal('');
  quantity = signal(1);

  purchaseOptions = computed(() =>
    this.customers().map(customer => ({
      value: customer.id,
      label: customer.name
    }))
  );

  productOptions = computed(() =>
    this.suppliers().map( item => ({
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
          price:this.price(),
          quantity: this.quantity()
        }
      ]
    }));

    this.selectedProductId.set('');
    this.quantity.set(1);
    this.price.set(1);

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
    console.log(this.invoice())

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
