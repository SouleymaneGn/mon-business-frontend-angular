import { Component, computed, inject, signal } from '@angular/core';
import { ButtonComponent } from "../../shared/components/ui/button/button.component";
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalService } from '../../shared/services/modal.service';
import { PurchaseService } from './purchase.service';
import { ProductsService } from '../products/products.service';
import { LabelComponent } from "../../shared/components/form/label/label.component";
import { InputFieldComponent } from "../../shared/components/form/input/input-field.component";
import { Router, RouterLink } from "@angular/router";
import { SelectComponent } from "../../shared/components/form/select/select.component";
import { SupplierService } from '../suppliers/supplier.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-purchases',
  imports: [ReactiveFormsModule, SelectComponent, ButtonComponent, CommonModule],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.css',
})
export class PurchasesComponent {
router = inject(Router);
private purchaseService = inject(PurchaseService);

  purchases = signal<any[]>([]);


  ngOnInit(): void {
    this.loadPurchases();
  }
  
  navigateTo(){
    this.router.navigate(["purchase"])
  }
  loadPurchases() {
    this.purchaseService.getAllPurchases().subscribe({
      next: (data) => {
        this.purchases.set(data);
        console.log(data)
      },
      error: (err) => console.error(err)
    });
  }
}