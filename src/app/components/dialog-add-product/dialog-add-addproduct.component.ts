import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api-services.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AutocompelteService } from 'src/app/services/autocompelte.service';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-dialog-add-addproduct',
  templateUrl: './dialog-add-product.component.html',
  styleUrls: ['./dialog-add-product.component.scss']
})
export class DialogAddproductComponent implements OnInit {
  actionBtn: string = 'Save'

  isclick: boolean = false;
  using() {
    this.isclick = true;
  }
  noUsing() {
    this.isclick = false;
  }

  NameUser = ['quyet3', 'quyet2', 'quyet1']
  filteredOptions: any;

  productForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private notifier: NotifierService,
    private dialogRef: MatDialogRef<DialogAddproductComponent>,
    private apiNameUser: AutocompelteService,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) { }

  ngOnInit(): void {

    this.productForm = this.formBuilder.group({
      productName: ['', [Validators.required, Validators.minLength(4)]],
      productCategory: ['', Validators.required],
      productDate: ['', Validators.required],
      productStatus: ['clear', [Validators.required]],
      userName: ['',],
      // productImg: ['', Validators.required],
      productComment: ['']
    })

    // lấy data vào lại form trong phần update
    if (this.editData) {
      this.actionBtn = 'Update'
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['productCategory'].setValue(this.editData.productCategory);
      this.productForm.controls['productDate'].setValue(this.editData.productDate);
      this.productForm.controls['productStatus'].setValue(this.editData.productStatus);
      this.productForm.controls['userName'].setValue(this.editData.userName);
      // this.productForm.controls['productImg'].setValue(this.editData.productImg);
      this.productForm.controls['productComment'].setValue(this.editData.productComment);
    }

    this.productForm.get('userName')?.valueChanges.subscribe(response => {
      this.filterData(response)
    })
    this.getName()
  }

  filterData(enteredData: any) {
    this.filteredOptions = this.NameUser.filter(user => {
      return user?.toLocaleLowerCase().indexOf(enteredData?.toLocaleLowerCase()) > - 1
    })
  }

  getName() {
    this.apiNameUser.getUserName()
      .subscribe(response => {
        this.NameUser = response
        this.filteredOptions = response
      })
  }

  get productName() {
    return this.productForm.get('productName')
  } get productCategory() {
    return this.productForm.get('productCategory')
  } get productDate() {
    return this.productForm.get('productDate')
  } get productStatus() {
    return this.productForm.get('productStatus')
  } get userName() {
    return this.productForm.get('userName')
  }
  //  get productImg() {
  //   return this.productForm.get('productImg')
  // }
  get productComment() {
    return this.productForm.get('productComment')
  }

  addProduct() {
    if (!this.editData) {
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value)
          .subscribe({
            next: (_res) => {
              this.notifier.showNotification('Product Added', 'oke', 'success')
              this.productForm.reset();
              this.dialogRef.close('Add Product');
            },
            error: () => {
              this.notifier.showNotification('There was an error', 'oke', 'error')
            }
          })
      }
    }
    else {
      this.updateProduct()
    }
  }
  updateProduct() {
    this.api.putProduct(this.productForm.value, this.editData.id)
      .subscribe({
        next: (res) => {
          this.dialogRef.close('Update');
          this.productForm.reset();
        },
        error: () => {
          this.notifier.showNotification('There was an error', 'oke', 'error')
        }
      })
  }
  /// upload anh
  selectFile = null;
  onFileSelected(event: any) {
    this.selectFile = event.target.files[0];

  }
}
