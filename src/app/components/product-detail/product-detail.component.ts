import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAddproductComponent } from '../dialog-add-product/dialog-add-addproduct.component';
import { ApiService } from 'src/app/services/api-services.service';
import { NotifierService } from 'src/app/services/notifier.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  displayedColumns: string[] = ['productName', 'category', 'date', 'productStatus', 'productUser', 'comment', 'edit'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private api: ApiService,
    private notifier: NotifierService,
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.getAllProduct()
  }

  openDialog() {
    this.dialog.open(DialogAddproductComponent, {
      minWidth: '45%',
    }).afterClosed().subscribe(val => {
      if (val === 'Add Product') {
        this.getAllProduct()
      }
    })
  }

  getAllProduct() {
    this.api.getProduct()
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
  editProduct(row: any) {
    this.dialog.open(DialogAddproductComponent, {
      width: '40%',
      data: row,
    }).afterClosed().subscribe(val => {
      if (val === 'Update') {
        this.notifier.showNotification('Product Update', 'oke', 'success')
        this.getAllProduct()
      }
    })
  }

  deleteProduct(id: number) {
    this.api.deleteProduct(id)
      .subscribe({
        next: () => {
          this.notifier.showNotification('Product Delete', 'oke', 'success')
          this.getAllProduct()
        },
        error: () => {
          this.notifier.showNotification('There was an error', 'oke', 'error')
        },
        complete: () => {
          console.log('deleteis product ok');
        },
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
    this.router.navigate(['login'])}
}
