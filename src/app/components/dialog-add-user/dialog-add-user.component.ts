import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api-services.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-add-user',
  templateUrl: './dialog-add-user.component.html',
  styleUrls: ['./dialog-add-user.component.scss']
})
export class DialogAddUserComponent implements OnInit {
  actionBtn: string = 'Save'

  userForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private notifier: NotifierService,
    private dialogRef: MatDialogRef<DialogAddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) { }

  ngOnInit(): void {

    this.userForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(4)]],
      gender: ['https://cdn.icon-icons.com/icons2/2248/PNG/512/gender_male_icon_137554.png', Validators.required],
      birthDate: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      email: ['', [Validators.required, Validators.email]],
    })
    // lấy data vào lại form trong phần update
    if (this.editData) {
      this.actionBtn = 'Update'
      this.userForm.controls['userName'].setValue(this.editData.userName);
      this.userForm.controls['gender'].setValue(this.editData.gender);
      this.userForm.controls['birthDate'].setValue(this.editData.birthDate);
      this.userForm.controls['phoneNumber'].setValue(this.editData.phoneNumber);
      this.userForm.controls['email'].setValue(this.editData.email);
    }
  }
  get userName() {
    return this.userForm.get('userName')
  }
  get gender() {
    return this.userForm.get('gender')
  }
  get birthDate() {
    return this.userForm.get('birthDate')
  }
  get phoneNumber() {
    return this.userForm.get('phoneNumber')
  }
  get email() {
    return this.userForm.get('email')
  }

  addUser() {
    if (!this.editData) {
      if (this.userForm.valid) {
        this.api.postUser(this.userForm.value)
          .subscribe({
            next: (_res) => {
              this.notifier.showNotification('User Added', 'oke', 'success')
              this.userForm.reset();
              this.dialogRef.close('Add User');
            },
            error: () => {
              this.notifier.showNotification('There was an error', 'oke', 'error')
            }
          })
      }
    }
    else{
      this.updateUser()
    }
  }
  updateUser(){
    this.api.putUer(this.userForm.value,this.editData.id)
    .subscribe({
      next: (res) => {
        this.dialogRef.close('Update');
        this.userForm.reset();
      },
      error: () => {
        this.notifier.showNotification('There was an error', 'oke', 'error')
      }
    })
  }

}
