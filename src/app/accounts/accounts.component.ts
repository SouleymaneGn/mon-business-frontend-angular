import { Component, signal } from '@angular/core';
import { ButtonComponent } from "../shared/components/ui/button/button.component";
import { InputFieldComponent } from "../shared/components/form/input/input-field.component";
import { LabelComponent } from "../shared/components/form/label/label.component";
import { ModalComponent } from '../shared/components/ui/modal/modal.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalService } from '../shared/services/modal.service';
import { AccountService } from './account.service';

@Component({
  selector: 'app-accounts',
  imports: [CommonModule,
    ButtonComponent,
    LabelComponent,
    InputFieldComponent,
    ReactiveFormsModule,
    ModalComponent, FormsModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
})
export class AccountsComponent {
 constructor(public modal: ModalService, private accountService  : AccountService ) {}

  isOpen = signal<boolean>(false);
  openModal() { this.isOpen.set(true); }
  closeModal() { this.isOpen.set(false); }

    accounts = signal<any>([{}])
    ngOnInit(): void {
      this.getAllCustomer()
    }

    getAllCustomer(){
      this.accountService.getAll().subscribe(account=>{
        this.accounts.set(account)
        console.log(account)
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
  balance : new FormControl(0),
 
})

handleSave() {

  if (this.form.invalid) return;

  const customer = this.form.getRawValue();

  this.accountService.create(customer).subscribe({
    next: (response) => {

      console.log(response);

      // recharge la liste APRES sauvegarde
      this.getAllCustomer();

      // fermer modal
      this.closeModal();

      // reset formulaire
      this.form.reset({
        name: '',
        balance: 0
      });

    },

    error: (err) => {
      console.error(err);
    }
  });
}
}
