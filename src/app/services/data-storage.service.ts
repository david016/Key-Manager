import { Injectable } from "@angular/core";
import { ApiKey } from "../api-keys/api-key.model";
import { Observable, catchError, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Key } from "../models/key";
import { KeyType } from "../models/key-types";
import { DbUser } from "../models/dbUser";
import "firebase/database";

@Injectable({
  providedIn: "root",
})
export class DataStorageService {
  private baseUrl: string = "https://apikeys-cf564-default-rtdb.firebaseio.com";
  constructor(private http: HttpClient) {}

  getKeys(type: KeyType): Observable<{ [key: string]: Key }> {
    return this.http
      .get<{ [key: string]: Key }>(this.buildUrl(type))
      .pipe(catchError(this.handleError));
  }

  getFilteredKeys(userId: string, type: KeyType): Observable<Key[]> {
    const url = `${this.buildUrl(type)}?orderBy="userId"&equalTo="${userId}"`;

    return this.http.get<Key[]>(url).pipe(catchError(this.handleError));
  }

  getKey(type: KeyType, id: string): Observable<Key> {
    return this.http
      .get<Key>(this.buildUrl(type, id))
      .pipe(catchError(this.handleError));
  }

  saveKey(key: Key, type: KeyType): Observable<Key> {
    return this.http
      .post<Key>(this.buildUrl(type), {
        ...key,
      })
      .pipe(catchError(this.handleError));
  }

  editKey(keyId: string, key: Key, type: KeyType): Observable<ApiKey> {
    return this.http
      .patch<ApiKey>(this.buildUrl(type, keyId), { ...key })
      .pipe(catchError(this.handleError));
  }

  deleteKey(keyId: string, type: KeyType): Observable<ApiKey> {
    return this.http
      .delete<ApiKey>(this.buildUrl(type, keyId))
      .pipe(catchError(this.handleError));
  }

  private handleError(error: Error): Observable<never> {
    console.error(error);
    return throwError(() => error);
  }

  getUser(uId: string) {
    return this.http.get<DbUser>(`${this.baseUrl}/users/${uId}.json`);
  }

  editUser(user: DbUser) {
    return this.http.patch<DbUser>(`${this.baseUrl}/users/${user.uId}.json`, {
      ...user,
    });
  }

  saveUser(user: DbUser, localUId: string) {
    return this.http.put(`${this.baseUrl}/users/${localUId}.json`, user);
  }

  private buildUrl(resourceType: KeyType, id?: string): string {
    if (id) {
      return `${this.baseUrl}/${resourceType}/${id}.json`;
    }
    return `${this.baseUrl}/${resourceType}.json`;
  }
}
