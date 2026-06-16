import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../shared/components/ui/button/button.component';
import { Router, RouterLink } from '@angular/router';
import { InputFieldComponent } from '../shared/components/form/input/input-field.component';
import { LabelComponent } from '../shared/components/form/label/label.component';
import { ModalComponent } from '../shared/components/ui/modal/modal.component';
import { SelectComponent } from '../shared/components/form/select/select.component';
import { InvoiceService } from '../pages/invoice.service';
import { CustomerService } from '../pages/customer/customer.service';

@Component({
  selector: 'app-invoices',
  imports: [ButtonComponent,CommonModule, RouterLink, InputFieldComponent, LabelComponent, ModalComponent, SelectComponent, ],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css',
})
export class InvoicesComponent implements OnInit{
handlePayment() {
throw new Error('Method not implemented.');
}

  options = [
    { value: 'CASH', label: 'CASH' },
    { value: 'ORANGE_MONEY', label: 'ORANGE_MONEY' },
    { value: 'MOBILE_MONEY', label: 'MOBILE_MONEY' },
    { value: 'VIREMENT', label: 'VIREMENT' },

  ];
  router = inject(Router)
   
selectedMethod = signal<string>("")
customerSelect = signal<any>("")
  isOpen = signal<boolean>(false);
  openModal(cutomerId:string, invoiceId:string) {
     this.isOpen.set(true); 
     this.customerSelect.set(cutomerId)
     this.form.patchValue({customerId:cutomerId})
     this.form.patchValue({invoiceId:invoiceId})

    }
  closeModal() { this.isOpen.set(false); }
  selectCutomer(cutomerId:string){
  
  //     const customer = this.().find(
  //   p => p.id === productId
  // );

  // if (product) {
  //   this.price.set(product.price);
  // }
  }
ngOnInit(): void {
    this.getAllInvoice()
    this.getAllCustomer()
  }
  private invoiceService = inject(InvoiceService)
  invoices = signal<any>([])


remainingAmount = signal<number>(0);

getAllInvoice() {
  this.invoiceService.getAllInvoices().subscribe(invoices => {

    this.invoices.set(invoices);
    console.log(invoices)
   

  });
}


form =  new FormGroup({
    method:  new FormControl(""),
    invoiceId: new FormControl('', {}) ,
    customerId:  new FormControl(''),
    amount:  new FormControl(1, {validators: [Validators.required],nonNullable:true}),
    note: new FormControl('',{validators: [Validators.required],nonNullable:true})
})

handleMethodChange(method: string) {
  this.selectedMethod.set(method);
}

handleSave() {
  const payload = {
    invoiceId: this.form.controls.invoiceId.value,
    customerId: this.form.controls.customerId.value,
    amount: this.form.controls.amount.value,
    method: this.selectedMethod(),
    note: this.form.controls.note.value
  }; 
  this.invoiceService.invoicePayment(payload).subscribe({
   next:response=>{
     console.log(response)
      this.getAllInvoice();
      // fermer modal
      this.closeModal();
   },
   error: error => console.log(error)
  })


}
cutomerService = inject(CustomerService)
customerOptions = signal<any>([])



getAllCustomer(){
this.cutomerService.getAllCustomers().subscribe(customers=>{
  this.customerOptions.set(customers)
})
}
}
