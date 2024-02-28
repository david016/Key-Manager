import { NgModule } from "@angular/core";

import { AuthRoutingModule } from "./auth-routing.module";
import { AuthComponent } from "./auth/auth.component";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AuthComponent],
  imports: [SharedModule, AuthRoutingModule, FormsModule],
})
export class AuthModule {}
