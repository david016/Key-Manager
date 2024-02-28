import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable, catchError, map, of, switchMap, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const idToken = localStorage.getItem("idToken");
    if (idToken) {
      return this.authService.authUser.pipe(
        take(1),
        switchMap((user) => {
          if (user) {
            return of(true);
          }
          // Initialize user from local storage
          return this.authService.initUserFromLocalStorage(idToken).pipe(
            map((data) => {
              return !!data || this.router.createUrlTree(["/auth/login"]);
            }),
            catchError((error) => {
              console.error("Error initializing user:", error);
              return of(this.router.createUrlTree(["/auth/login"]));
            })
          );
        })
      );
    }
    return of(this.router.createUrlTree(["/auth/login"]));
  }
}
