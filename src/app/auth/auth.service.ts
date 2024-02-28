import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, firstValueFrom, tap } from "rxjs";
import { AuthUser } from "./authUser";
import { UserService } from "../user/user.service";
import { UserInfoResponse } from "./types/user-info-res";

export interface AuthResponseData {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
  email: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private tokenExpirationTimer: any;
  authUser = new BehaviorSubject<AuthUser>(null);
  constructor(private http: HttpClient, private userService: UserService) {}

  initUserFromLocalStorage(idToken: string) {
    return this.getUserInfo().pipe(
      tap((data) => {
        const authUser = new AuthUser(
          data.users[0].localId,
          data.users[0].email,
          idToken
        );
        this.authUser.next(authUser);
        this.userService.getUser(authUser.localId).subscribe();
      })
    );
  }

  async signUp(email: string, password: string): Promise<any> {
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseApiKey}`,
          {
            email: email,
            password: password,
            returnSecureToken: true,
          }
        )
      );

      const dbUser = this.userService.createUser(email, res.localId);

      this.userService.addToDb(dbUser, res.localId);
      return res;
    } catch (err) {
      console.log(err, "error");
      return null;
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const res = await firstValueFrom(
        this.http.post<AuthResponseData>(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseApiKey}`,
          {
            email: email,
            password: password,
            returnSecureToken: true,
          }
        )
      );

      const expirationDate = new Date(
        new Date().getTime() + Number(res.expiresIn) * 1000
      );
      const authUser = new AuthUser(
        res.localId,
        res.email,
        res.idToken,
        res.refreshToken,
        res.expiresIn
      );

      this.authUser.next(authUser);
      localStorage.setItem("tokenExpirationDate", expirationDate.toString());
      localStorage.setItem("idToken", res.idToken);
      this.userService.getUser(res.localId).subscribe();
      this.setLogoutTimer(Number(res.expiresIn) * 1000);

      return res;
    } catch (err) {
      const error = new Error("Error during login");
      error["info"] = err;
      throw error;
    }
  }

  logout() {
    localStorage.removeItem("idToken");
    localStorage.removeItem("dbUser");
    localStorage.removeItem("tokenExpirationDate");
    window.location.reload();
  }

  getUserInfo() {
    let idToken = localStorage.getItem("idToken");

    return this.http.post<UserInfoResponse>(
      "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" +
        environment.firebaseApiKey,
      {
        idToken: idToken,
      }
    );
  }

  private setLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
