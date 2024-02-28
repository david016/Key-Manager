import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LicenceKeysComponent } from "./licence-keys/licence-keys.component";
import { AuthGuard } from "../auth/auth.guard";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: LicenceKeysComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LicenceKeysRoutingModule {}
