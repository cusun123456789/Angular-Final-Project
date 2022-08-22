import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  // Phần api sản phẩm
  postProduct(data: any){
    return this.http.post<any>("http://localhost:3000/productList/",data);
  }
  getProduct() {
    return this.http.get<any>("http://localhost:3000/productList/");
  }
  putProduct(data: any, id : number) {
    return this.http.put<any>("http://localhost:3000/productList/"+id, data);
  }
  deleteProduct(id : number) {
    return this.http.delete<any>("http://localhost:3000/productList/"+id)
  }
  getProductDetail() {
    return this.http.get<any>("http://localhost:3000/productList/")
      .pipe(map((res:any)=>{
        return res;
        }
      ))
  }
  // phần Api người dùng
  getUser() {
    return this.http.get<any>("http://localhost:3000/Users/");
  }
  postUser(data: any){
    return this.http.post<any>("http://localhost:3000/Users/",data);
  }
  putUer(data: any, id : number) {
    return this.http.put<any>("http://localhost:3000/Users/"+id, data);
  }
  deleteUser(id : number) {
    return this.http.delete<any>("http://localhost:3000/Users/"+id)
  }


// phần Api login sing in user
getUserLogin() {
  return this.http.get<any>("http://localhost:3000/profile/");
}
postUserSingin(data: any){
  return this.http.post<any>("http://localhost:3000/profile/",data);
}
}
