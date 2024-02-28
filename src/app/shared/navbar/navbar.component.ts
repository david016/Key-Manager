import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
} from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { AuthUser } from "src/app/auth/authUser";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  user: AuthUser;
  userSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.authUser.subscribe((user) => {
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event): void {
    if (event.target.innerWidth >= 992) {
      const navbar = this.el.nativeElement.querySelector("#navbar-default");
      const toggler = this.el.nativeElement.querySelector(".navbar-toggler");

      if (navbar && toggler && navbar.classList.contains("show")) {
        this.renderer.removeClass(navbar, "show");
        this.renderer.setAttribute(toggler, "aria-expanded", "false");
      }
    }
  }
}
