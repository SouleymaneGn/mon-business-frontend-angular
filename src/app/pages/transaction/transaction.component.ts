import { Component, inject, OnInit, signal } from '@angular/core';
import { TransationService } from './transation.service';
import { TableDropdownComponent } from '../../shared/components/common/table-dropdown/table-dropdown.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { ModalService } from '../../shared/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectComponent } from "../../shared/components/form/select/select.component";
import { Customer, CustomerService } from '../customer/customer.service';
import { ComponentCardComponent } from "../../shared/components/common/component-card/component-card.component";
import { RadioComponent } from "../../shared/components/form/input/radio.component";
import { Router } from '@angular/router';
import { AccountService } from '../../accounts/account.service';



@Component({
  selector: 'app-transaction',
  imports: [TableDropdownComponent, ButtonComponent, CommonModule, ModalComponent, InputFieldComponent, LabelComponent, SelectComponent, ComponentCardComponent, RadioComponent],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent implements OnInit {

handleSelectChange(value: string) {
  this.selectedValue.set(value)
    this.form.patchValue({
    clientId: value
  });
}
constructor(public modal: ModalService) {}
  isOpen = signal<boolean>(false);
  openModal() { this.isOpen.set(true); }
  closeModal() { this.isOpen.set(false); }

ngOnInit(): void {
  this.getAllTransaction()
  this.optionCustomer()
  this.optionAccount()
}
transactionService = inject(TransationService)
customerService = inject(CustomerService)
accountService = inject(AccountService)
transactions = signal<any>([])
customers = signal<Customer[]>([])
accounts = signal<any>([])
selectedValue = signal<string>('')
selectedAccount = signal<string>("")
customerOptions = signal<
  { value: string; label: string }[]
>([]);

accountOptions = signal<
{
  value:string; label: string
}[]>([])


getAllTransaction(){
  this.transactionService.getAllTransaction().subscribe(transactions =>{
    this.transactions.set(transactions)
    console.log('transaction liste :', transactions,);
    
  })
}

optionCustomer() {
  this.customerService.getAllCustomers().subscribe((customers: Customer[]) => {

    this.customers.set(customers);

    this.customerOptions.set(
      customers.map((customer) => ({
        value: customer.id,
        label: customer.name
      }))
    );

    console.log("liste des client", customers);
  });
}

optionAccount() {
  this.accountService.getAll().subscribe((accounts: any[]) => {

    this.accounts.set(accounts);

    this.accountOptions.set(
      accounts.map((account) => ({
        value: account.id,
        label: account.name,
      }))
    );

    console.log("Liste des comptes :", accounts);
    console.log("Options :", this.accountOptions());
  });
}
 getBadgeColor(status: string): 'success' | 'warning' | 'error' {
    if (status === 'Active') return 'success';
    if (status === 'Pending') return 'warning';
    return 'error';
  }


  form = new FormGroup({
    clientId: new FormControl('', {
    validators: [Validators.required],
    nonNullable: true
  }),
   accountId: new FormControl('', {
    validators: [Validators.required],
    nonNullable: true
  }),
  type: new FormControl('', {validators: [Validators.required],nonNullable:true}),
  amount : new FormControl(0, {validators: [Validators.required], nonNullable: true}),
  note : new FormControl('', {validators: [Validators.required], nonNullable: true}),


 
})

  selectedValueRadio: string = 'option2';

  handleRadioChange(value: string) {
    console.log(value,'value')
    this.selectedValueRadio = value;
    this.form.patchValue({type:value})
  }


handleSave() {

 if (this.form.invalid) return;

  const transaction :{
    type: string
    clientId: string
    amount: number,
    note: string,
  } = this.form.getRawValue();
  console.log(transaction)

  this.transactionService.addTransaction(transaction).subscribe({
    next: (response) => {

      console.log(response);

      // recharge la liste APRES sauvegarde
      this.getAllTransaction();

      // fermer modal
      this.closeModal();

      // reset formulaire
      this.form.reset({
        type: '',
        clientId: '',
        accountId:'',
        amount:0,
        note:""
      });

    },

    error: (err) => {
      console.error(err);
    }
  });
}
handleAccountChange(value: string) {
  this.selectedAccount.set(value);

  this.form.patchValue({
    accountId: value,
  });
}
}
