import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ApiKey } from "src/app/api-keys/api-key.model";
import { LicenceKey } from "src/app/licence-keys/licence-key.model";
import { KeyType } from "src/app/models/key-types";
import { KeyService } from "src/app/services/key.service";
import { UserService } from "src/app/user/user.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  apiKeys: ApiKey[];
  licenceKeys: LicenceKey[];
  expiringLicenceKeys: LicenceKey[];
  nextKeyToExpire: LicenceKey;
  isLoading = true;

  constructor(
    private userService: UserService,
    private keyService: KeyService
  ) {}

  ngOnInit(): void {
    const userSub = this.userService.dbUser.subscribe((dbUser) => {
      if (dbUser) {
        if (!this.keyService.areApiKeysInitialized) {
          this.keyService.initializeKeys(dbUser.uId, KeyType.apiKey);
        }

        if (!this.keyService.areLicenceKeysInitialized) {
          this.keyService.initializeKeys(dbUser.uId, KeyType.licenceKey);
        }
      }
    });

    this.subscriptions.push(userSub);
    this.subscribeToKeyUpdates();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private subscribeToKeyUpdates(): void {
    const apiObs$ = this.keyService.apiKeyArr$;
    const licenceObs$ = this.keyService.licenceKeyArr$;

    const apiSub = apiObs$.subscribe((keys) => {
      this.apiKeys = keys;
    });

    const licenceSub = licenceObs$.subscribe((keys) => {
      this.licenceKeys = keys;
      this.isLoading = false;
      // Find the next key to expire
      if (this.licenceKeys && this.licenceKeys.length > 0) {
        this.nextKeyToExpire = this.licenceKeys.reduce((acc, key) => {
          return key.expireAt < acc.expireAt ? key : acc;
        });
      }
    });

    this.subscriptions.push(apiSub);
    this.subscriptions.push(licenceSub);
  }
}
