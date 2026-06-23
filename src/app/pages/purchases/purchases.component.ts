import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../shared/services/modal.service';
import { PurchaseService } from './purchase.service';
import { ProductsService } from '../products/products.service';
import { LabelComponent } from "../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../shared/components/form/input/input-field.component";
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-purchases',
  imports: [ButtonComponent, ModalComponent, ReactiveFormsModule, LabelComponent, InputFieldComponent, RouterLink],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.css',
})
export class PurchasesComponent {
router = inject(Router)
navigateToCreatePurchase() {
  this.router.navigate(['purchase'])
}
constructor(
   public modal: ModalService,
   private purchaseService  : PurchaseService,
   private productService : ProductsService
  ) {}

  isOpen = signal<boolean>(false);
  openModal() { this.isOpen.set(true); }
  closeModal() { this.isOpen.set(false); }
// purchases 
 purchase = signal({
    supplierId: '',
    paidAmount: 0,
    items: [] as {
      productId: string;
      price:number
      purchasePrice: number;
    }[]
  });

  products = signal<any>([])

  suppliers = signal<any>([{}])
    ngOnInit(): void {
      this.getAllSupplier()
    }

    getAllSupplier(){
      this.purchaseService.getAllPurchases().subscribe(customers=>{
        this.suppliers.set(customers)
        console.log(customers)
      })
    }
  

 
  // getBadgeColor(status: string): 'success' | 'warning' | 'error' {
  //   if (status === 'Active') return 'success';
  //   if (status === 'Pending') return 'warning';
  //   return 'error';
  // }


  form = new FormGroup({
  name: new FormControl('', {validators: [Validators.required],nonNullable:true}),
  phone : new FormControl('', {validators: [Validators.required], nonNullable: true}),
  address : new FormControl('', {validators: [Validators.required], nonNullable: true}),

 
})

handleSave() {

  if (this.form.invalid) return;

  const supplier = this.form.getRawValue();

  this.purchaseService.savePurchases(supplier).subscribe({
    next: (response) => {

      console.log(response);

      // recharge la liste APRES sauvegarde
      this.getAllSupplier();

      // fermer modal
      this.closeModal();

      // reset formulaire
      this.form.reset({
        name: '',
        phone: ''
      });

    },

    error: (err) => {
      console.error(err);
    }
  });
}
}
