import { NgModule } from "@angular/core";

import { LicenceKeysRoutingModule } from "./licence-keys-routing.module";
import { LicenceKeysComponent } from "./licence-keys/licence-keys.component";
import { SharedModule } from "../shared/shared.module";
import { SharedForKeysModule } from "../shared-for-keys/shared-for-keys.module";

@NgModule({
  declarations: [LicenceKeysComponent],
  imports: [SharedModule, LicenceKeysRoutingModule, SharedForKeysModule],
})
export class LicenceKeysModule {}
