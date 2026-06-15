import { Component, signal } from '@angular/core';
import { TableDropdownComponent } from "../../shared/components/common/table-dropdown/table-dropdown.component";
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from './products.service';
import { ModalService } from '../../shared/services/modal.service';
import { ModalComponent } from "../../shared/components/ui/modal/modal.component";
import { InputFieldComponent } from "../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../shared/components/form/label/label.component";

@Component({
  selector: 'app-products',
  imports: [TableDropdownComponent, ButtonComponent, CommonModule, ModalComponent, InputFieldComponent, LabelComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {

constructor(public modal: ModalService, private productService  : ProductsService) {}

  isOpen = signal<boolean>(false);
  openModal() { this.isOpen.set(true); }
  closeModal() { this.isOpen.set(false); }

    products = signal<any>([{}])
    ngOnInit(): void {
      this.getAllProducts()
    }

    getAllProducts(){
      this.productService.getAllProducts().subscribe(products=>{
        this.products.set(products)
        console.log(products)
      })
    }
  

 
  getBadgeColor(status: string): 'success' | 'warning' | 'error' {
    if (status === 'Active') return 'success';
    if (status === 'Pending') return 'warning';
    return 'error';
  }

    address = {
    country: 'United States.',
    cityState: 'Phoenix, Arizona, United States.',
    postalCode: 'ERT 2489',
    taxId: 'AS4568384',
  };

  form = new FormGroup({
  name: new FormControl('', {validators: [Validators.required],nonNullable:true}),
  price : new FormControl(0, {validators: [Validators.required], nonNullable: true}),
  stock : new FormControl(0, {validators: [Validators.required], nonNullable: true}),

 
})

handleSave() {

  if (this.form.invalid) return;

  const product = this.form.getRawValue();

  this.productService.saveCustomer(product).subscribe({
    next: (response) => {

      console.log(response);

      // recharge la liste APRES sauvegarde
      this.getAllProducts();

      // fermer modal
      this.closeModal();

      // reset formulaire
      this.form.reset({
        name: '',
        price: 0,
        stock:0
      });

    },

    error: (err) => {
      console.error(err);
    }
  });
}
}
