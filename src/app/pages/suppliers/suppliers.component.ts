import { Component, signal } from '@angular/core';
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { InputFieldComponent } from "../../shared/components/form/input/input-field.component";
import { LabelComponent } from "../../shared/components/form/label/label.component";
import { ModalService } from '../../shared/services/modal.service';
import { SupplierService } from './supplier.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';

@Component({
  selector: 'app-suppliers',
  imports: [ButtonComponent, InputFieldComponent, LabelComponent, ReactiveFormsModule,
    ModalComponent],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css',
})
export class SuppliersComponent {
constructor(public modal: ModalService, private supplierService  : SupplierService) {}

  isOpen = signal<boolean>(false);
  openModal() { this.isOpen.set(true); }
  closeModal() { this.isOpen.set(false); }

    suppliers = signal<any>([{}])
    ngOnInit(): void {
      this.getAllSupplier()
    }

    getAllSupplier(){
      this.supplierService.getAllSuppliers().subscribe(customers=>{
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

  this.supplierService.saveCustomer(supplier).subscribe({
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
