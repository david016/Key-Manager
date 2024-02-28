import { Injectable } from "@angular/core";
import { DataStorageService } from "./data-storage.service";
import { KeyType } from "../models/key-types";
import { Key } from "../models/key";
import { BehaviorSubject, Observable, catchError, tap, throwError } from "rxjs";
import { LicenceKey } from "../licence-keys/licence-key.model";
import { ApiKey } from "../api-keys/api-key.model";

@Injectable({
  providedIn: "root",
})
export class KeyService {
  private apiKeysArrSubject = new BehaviorSubject<ApiKey[]>(null);
  private licenceKeysArrSubject = new BehaviorSubject<LicenceKey[]>(null);

  public apiKeyArr$: Observable<ApiKey[]> =
    this.apiKeysArrSubject.asObservable();
  public licenceKeyArr$: Observable<LicenceKey[]> =
    this.licenceKeysArrSubject.asObservable();

  public areApiKeysInitialized = false;
  public areLicenceKeysInitialized = false;

  constructor(private dataService: DataStorageService) {}

  getKeyById(id: string, type: KeyType): Observable<Key> {
    return this.dataService.getKey(type, id).pipe(
      tap((key: Key) => {
        this.updateAndEmitKeys(key, type);
      }),
      catchError(this.handleError)
    );
  }

  editKey(currentKey: Key, type: KeyType): Observable<Key> {
    return this.dataService.editKey(currentKey.keyId, currentKey, type).pipe(
      tap(() => {
        const subject = this.getSubject(type);
        const currentKeys = [...subject.value];
        const indexToUpdate = currentKeys.findIndex(
          (k) => k.keyId === currentKey.keyId
        );

        if (indexToUpdate !== -1) {
          currentKeys[indexToUpdate] = currentKey;
          subject.next(currentKeys);
        }
      }),
      catchError(this.handleError)
    );
  }

  addNewKey(key: Key, type: KeyType) {
    return this.dataService.saveKey(key, type).pipe(
      tap((data) => {
        const subject = this.getSubject(type);
        key["keyId"] = data.name;
        // ? get current keys from databse?
        const currentKeys = [...subject.value];
        currentKeys.unshift(key);
        subject.next(currentKeys);
      }),
      catchError(this.handleError)
    );
  }

  deleteKey(id: string, type: KeyType) {
    return this.dataService.deleteKey(id, type).pipe(
      tap(() => {
        const subject = this.getSubject(type);
        const currentKeys = [...subject.value];
        const indexToUpdate = currentKeys.findIndex((k) => k.keyId === id);

        if (indexToUpdate !== -1) {
          currentKeys.splice(indexToUpdate, 1);
          subject.next(currentKeys);
        }
      }),
      catchError(this.handleError)
    );
  }

  getApiKeyArr(): Observable<Key[]> {
    return this.apiKeysArrSubject.asObservable();
  }

  getLicenceKeyArr(): Observable<Key[]> {
    return this.licenceKeysArrSubject.asObservable();
  }

  public initializeKeys(userId: string, type: KeyType): void {
    if (type === KeyType.apiKey && this.areApiKeysInitialized) {
      return;
    }
    if (type === KeyType.licenceKey && this.areLicenceKeysInitialized) {
      return;
    }

    this.fetchKeysByUserId(userId, type);

    if (type === KeyType.apiKey) {
      this.areApiKeysInitialized = true;
    }
    if (type === KeyType.licenceKey) {
      this.areLicenceKeysInitialized = true;
    }
  }

  fetchKeysByUserId(userId: string, type: KeyType): void {
    this.dataService.getFilteredKeys(userId, type).subscribe({
      next: (keyObject) => this.handleFetchedKeys(keyObject, type),
      error: (error) => this.handleError(error),
    });
  }

  private updateAndEmitKeys(key: Key, type: KeyType): void {
    const subject = this.getSubject(type);
    const currentKeys = [...subject.value, key];
    subject.next(currentKeys);
  }

  private handleFetchedKeys(keyObject: Key[], type: KeyType): void {
    const keysArray: Key[] = Object.keys(keyObject || {}).map((keyId) => {
      const keyData: Key = keyObject[keyId];

      if (type === KeyType.licenceKey) {
        const licenceKeyData = keyData as LicenceKey;
        if (!licenceKeyData.expireAt) {
          licenceKeyData.expireAt =
            licenceKeyData.createdAt + 30 * 24 * 60 * 60 * 1000;

          this.editKey(
            { ...licenceKeyData, keyId },
            KeyType.licenceKey
          ).subscribe({
            error: (error) => console.error("Error updating key:", error),
          });
        }
        return { ...licenceKeyData, keyId };
      }

      return { ...keyData, keyId };
    });
    keysArray.sort((a, b) => b.createdAt - a.createdAt);
    this.getSubject(type).next(keysArray);
  }

  private handleError(error: any) {
    console.error(error);
    return throwError(() => new Error(error));
  }

  private getSubject(type: KeyType): BehaviorSubject<Key[]> {
    return type === KeyType.apiKey
      ? this.apiKeysArrSubject
      : this.licenceKeysArrSubject;
  }

  getKeysByType(type: KeyType): Observable<Key[]> {
    return this.getSubject(type).asObservable();
  }

  fetchKeysByType(type: KeyType) {
    return type === KeyType.apiKey
      ? this.getApiKeyArr()
      : this.getLicenceKeyArr();
  }
}
