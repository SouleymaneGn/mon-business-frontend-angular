import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { ModalService } from '../../shared/services/modal.service';
import { CustomerService } from './customer.service';
import { LabelComponent } from "../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../shared/components/form/input/input-field.component";
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
@Component({
  selector: 'app-customer',
  imports: [BadgeComponent,
    CommonModule,
    ButtonComponent,
    LabelComponent,
    InputFieldComponent,
    ReactiveFormsModule,
    ModalComponent, FormsModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent implements OnInit {
    constructor(public modal: ModalService, private customerService  : CustomerService) {}

  isOpen = signal<boolean>(false);
  openModal() { this.isOpen.set(true); }
  closeModal() { this.isOpen.set(false); }

    customers = signal<any>([{}])
    ngOnInit(): void {
      this.getAllCustomer()
    }

    getAllCustomer(){
      this.customerService.getAllCustomers().subscribe(customers=>{
        this.customers.set(customers)
        console.log(customers)
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
  phone : new FormControl('', {validators: [Validators.required], nonNullable: true}),
 
})

handleSave() {

  if (this.form.invalid) return;

  const customer = this.form.getRawValue();

  this.customerService.saveCustomer(customer).subscribe({
    next: (response) => {

      console.log(response);

      // recharge la liste APRES sauvegarde
      this.getAllCustomer();

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

