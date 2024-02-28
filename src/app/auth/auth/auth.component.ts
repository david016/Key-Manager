import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent implements OnInit, OnDestroy {
  @ViewChild("loginForm", { static: false }) loginForm!: NgForm;
  @ViewChild("signupForm", { static: false }) signupForm!: NgForm;
  private routeSubscription: Subscription;
  loginMode: boolean;
  error = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.url.subscribe((url) => {
      this.loginMode = url[0].path === "login";
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const { logemail: email, logpass: password } = form.form.value;

    if (this.loginMode) {
      this.authService
        .login(email, password)
        .then((data) => this.handleLoginResponse(data))
        .catch((err) => this.handleError(err));
    } else {
      this.authService
        .signUp(email, password)
        .then((data) => this.handleSignupResponse(data))
        .catch((err) => this.handleError(err));
    }
  }

  handleLoginResponse = (result: any) => {
    if (result === null) {
      console.error("An error occurred during login");
      this.error = true;
    } else {
      this.router.navigate(["/"]);
    }
  };

  handleSignupResponse = (result: any) => {
    if (result === null) {
      console.error("An error occurred during sign up");
      this.error = true;
    } else {
      this.router.navigate(["/auth/login"]);
    }
  };

  handleError = (err: any) => {
    console.error("An error occurred:", JSON.stringify(err, null, 2));
    this.error = true;
  };

  changeMode() {
    const newUrlSegment = this.loginMode ? "signup" : "login";
    setTimeout(() => {
      this.router.navigate(["auth", newUrlSegment]);
    }, 500);
  }
}
