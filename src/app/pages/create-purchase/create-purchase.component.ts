import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../shared/services/modal.service';
import { ProductsService } from '../products/products.service';
import { LabelComponent } from "../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../shared/components/form/input/input-field.component";
import { Router, RouterLink } from "@angular/router";
import { SelectComponent } from "../../shared/components/form/select/select.component";
import { SupplierService } from '../suppliers/supplier.service';
import { PurchaseService } from '../purchases/purchase.service';

@Component({
  selector: 'app-create-purchase',
  imports: [ReactiveFormsModule, SelectComponent],
  templateUrl: './create-purchase.component.html',
  styleUrl: './create-purchase.component.css',
})
export class CreatePurchaseComponent {
router = inject(Router);

  private purchaseService = inject(PurchaseService);
  private supplierService = inject(SupplierService);
  private productService = inject(ProductsService);

  ngOnInit(): void {
    this.getAllSuppliers();
    this.getAllProducts();
  }

  purchase = signal({
    supplierId: '',
    paidAmount: 0,
    items: [] as {
      productId: string;
      quantity: number;
      purchasePrice: number;
    }[]
  });

  suppliers = signal<any[]>([]);
  products = signal<any[]>([]);

  selectedSupplierId = signal('');
  selectedProductId = signal('');

  quantity = signal(1);
  purchasePrice = signal(0);

  supplierOptions = computed(() =>
    this.suppliers().map(supplier => ({
      value: supplier.id,
      label: supplier.name
    }))
  );

  productOptions = computed(() =>
    this.products().map(product => ({
      value: product.id,
      label: `${product.name} (${product.stock})`
    }))
  );

  handleSupplierChange(supplierId: string) {

    this.selectedSupplierId.set(supplierId);

    this.purchase.update(purchase => ({
      ...purchase,
      supplierId
    }));
  }

  handleProductChange(productId: string) {

    this.selectedProductId.set(productId);

    const product = this.products().find(
      p => p.id === productId
    );

    if (product) {
      this.purchasePrice.set(product.purchasePrice ?? product.price);
    }
  }

  addItem() {

    if (!this.selectedProductId()) {
      return;
    }

    this.purchase.update(purchase => ({
      ...purchase,
      items: [
        ...purchase.items,
        {
          productId: this.selectedProductId(),
          quantity: this.quantity(),
          purchasePrice: this.purchasePrice()
        }
      ]
    }));

    this.selectedProductId.set('');
    this.quantity.set(1);
    this.purchasePrice.set(0);
  }

  removeItem(index: number) {

    this.purchase.update(purchase => ({
      ...purchase,
      items: purchase.items.filter((_, i) => i !== index)
    }));
  }

  getAllSuppliers() {

    this.supplierService.getAllSuppliers().subscribe(
      suppliers => {
        this.suppliers.set(suppliers);
        console.log(suppliers);
      }
    );
  }

  getAllProducts() {

    this.productService.getAllProducts().subscribe(
      products => {
        this.products.set(products);
        console.log(products);
      }
    );
  }

  createPurchase() {

    console.log(this.purchase());

    this.purchaseService
      .savePurchases(this.purchase())
      .subscribe({
        next: response => {

          console.log(response);

          this.purchase.set({
            supplierId: '',
            paidAmount: 0,
            items: []
          });

          this.selectedSupplierId.set('');
          this.selectedProductId.set('');
          this.quantity.set(1);
          this.purchasePrice.set(0);

          this.router.navigate(['/purchases']);
        },
        error: err => console.error(err)
      });
  }
  updatePaidAmount(event: Event) {
  const value = +(event.target as HTMLInputElement).value;

  this.purchase.update(purchase => ({
    ...purchase,
    paidAmount: value
  }));
}
}

