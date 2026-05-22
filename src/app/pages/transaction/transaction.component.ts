import { Component, inject, OnInit, signal } from '@angular/core';
import { Transaction, TransationService } from './transation.service';
import { TableDropdownComponent } from '../../shared/components/common/table-dropdown/table-dropdown.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { ModalService } from '../../shared/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-transaction',
  imports: [TableDropdownComponent, ButtonComponent, CommonModule, ModalComponent, InputFieldComponent, LabelComponent],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent implements OnInit {
constructor(public modal: ModalService) {}

  isOpen = signal<boolean>(false);
  openModal() { this.isOpen.set(true); }
  closeModal() { this.isOpen.set(false); }

ngOnInit(): void {
  this.getAllTransaction()
}
transactionService = inject(TransationService)
transactions = signal<any>([])

getAllTransaction(){
  this.transactionService.getAllTransaction().subscribe(transactions =>{
    this.transactions.set(transactions)
    console.log('transaction liste :', transactions,);
    
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

  // this.productService.saveCustomer(product).subscribe({
  //   next: (response) => {

  //     console.log(response);

  //     // recharge la liste APRES sauvegarde
  //     this.getAllProducts();

  //     // fermer modal
  //     this.closeModal();

  //     // reset formulaire
  //     this.form.reset({
  //       name: '',
  //       price: 0,
  //       stock:0
  //     });

  //   },

  //   error: (err) => {
  //     console.error(err);
  //   }
  // });
}
}
