import { Injectable } from "@angular/core";
import { DataStorageService } from "../services/data-storage.service";
import { DbUser } from "../models/dbUser";
import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  dbUser = new BehaviorSubject<DbUser>(null);

  constructor(private dbService: DataStorageService) {}

  getUser(uId: string): Observable<DbUser> {
    return this.dbService
      .getUser(uId)
      .pipe(tap((data) => this.updateUser(data)));
  }

  createUser(email: string, uId: string): DbUser {
    return new DbUser(uId, email);
  }

  addToDb(user: DbUser, uId: string) {
    this.dbService.saveUser(user, uId).subscribe();
  }

  editUser(user: DbUser) {
    return this.dbService.editUser(user).pipe(
      tap(() => {
        this.updateUser(user);
      })
    );
  }

  private updateUser(currentUser: DbUser): void {
    this.dbUser.next(currentUser);
  }
}
