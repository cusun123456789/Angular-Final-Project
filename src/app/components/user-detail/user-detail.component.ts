import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddUserComponent } from '../dialog-add-user/dialog-add-user.component';
import { ApiService } from 'src/app/services/api-services.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/services/dialog.service';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  displayedColumns: string[] = ['userName', 'gender', 'birthDate', 'phoneNumber', 'email', 'edit'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private api: ApiService,
    private notifier: NotifierService,
    private router: Router,
    private dialogService: DialogService,
  ) { }
  ngOnInit(): void {
    this.getAllUsers()
  }

  openDialog() {
    this.dialog.open(DialogAddUserComponent, {
      minWidth: '45%',
    }).afterClosed().subscribe(val => {
      if (val === 'Add User') {
        this.getAllUsers()
      }
    })
  }


  getAllUsers() {
    this.api.getUser()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          this.notifier.showNotification('There was an error', 'dismiss', 'error')
        }
      })
  }
  editUser(row: any) {
    this.dialog.open(DialogAddUserComponent, {
      width: '40%',
      data: row,
    }).afterClosed().subscribe(val => {
      if (val === 'Update') {
        this.notifier.showNotification('User Update', 'oke', 'success')
        this.getAllUsers()
      }
    })
  }

  deleteUser(id: number) {
    this.dialogService.opoenConfirmDialog('Do you want to delete this user')
      .afterClosed().subscribe(res => {
        if (res) {
          this.api.deleteUser(id)
            .subscribe({
              next: () => {
                this.notifier.showNotification('User Delete', 'oke', 'success')
                this.getAllUsers()
              },
              error: () => {
                this.notifier.showNotification('There was an error', 'oke', 'error')
              },
              complete: () => {
                // console.log('deleteis user success');
              },
            })
        }
      })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['login'])
  }
}
