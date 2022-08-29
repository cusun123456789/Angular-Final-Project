import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProductComponent } from '../components/delete-product/delete-product.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }
  opoenConfirmDialog(msg: string){
   return this.dialog.open(DeleteProductComponent,{
      width:'15%',
      position:{top:'100px'},
      panelClass: 'delete-product-container',
      data: {
        message : msg
      }
    })
  }
}
