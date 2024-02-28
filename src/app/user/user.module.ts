import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserRoutingModule } from "./user-routing.module";
import { UserComponent } from "./user/user.component";
import { UserCardComponent } from "./user-card/user-card.component";
import { UserEditComponent } from "./user-edit/user-edit.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [UserComponent, UserCardComponent, UserEditComponent],
  imports: [CommonModule, UserRoutingModule, ReactiveFormsModule],
})
export class UserModule {}
