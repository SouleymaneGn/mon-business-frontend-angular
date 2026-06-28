import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
 baseUrl = "http://localhost:3000/accounts"

 http = inject(HttpClient)

getAll() {
  return this.http.get<any>(this.baseUrl);
}

create(account: any) {
  return this.http.post<any>(this.baseUrl, account);
}

update(id: string, account: any) {
  return this.http.patch<any>(`${this.baseUrl}/${id}`, account);
}

delete(id: string) {
  return this.http.delete(`${this.baseUrl}/${id}`);
}
}
