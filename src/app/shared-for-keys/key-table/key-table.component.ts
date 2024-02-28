import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { KeyType } from "../../models/key-types";
import { Key } from "../../models/key";
import { Subscription } from "rxjs";
import { UserService } from "src/app/user/user.service";
import { KeyService } from "src/app/services/key.service";

@Component({
  selector: "app-key-table",
  templateUrl: "./key-table.component.html",
  styleUrls: ["./key-table.component.scss"],
})
export class KeyTableComponent implements OnInit, OnDestroy {
  @Input() type: KeyType;
  private subscriptions: Subscription[] = [];
  public KeyType = KeyType;

  keysPerPage = 6;
  currentPage = 1;
  userKeys: Key[];
  selectedKey: Key = null;
  selectedKeyId: string;
  formMode = false;

  constructor(
    private keyService: KeyService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.dbUser.subscribe((dbUser) => {
      if (dbUser) {
        if (
          this.type === KeyType.apiKey &&
          !this.keyService.areApiKeysInitialized
        ) {
          this.keyService.initializeKeys(dbUser.uId, KeyType.apiKey);
        }

        if (
          this.type === KeyType.licenceKey &&
          !this.keyService.areLicenceKeysInitialized
        ) {
          this.keyService.initializeKeys(dbUser.uId, KeyType.licenceKey);
        }
      }
    });

    this.subscribeToKeyUpdates();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  onPageChanged(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  getKeysToDisplay(): any[] {
    if (!this.userKeys) {
      return [];
    }
    const startIndex = (this.currentPage - 1) * this.keysPerPage;
    const endIndex = startIndex + this.keysPerPage;
    return this.userKeys.slice(startIndex, endIndex);
  }

  onEdit(key: Key) {
    this.selectedKeyId = key.keyId;
    this.selectedKey = key;
    this.formMode = true;
  }

  onDelete(key: Key) {
    this.selectedKey = key;
  }

  onAddNew() {
    this.selectedKey = null;
    this.formMode = true;
  }

  private subscribeToKeyUpdates(): void {
    const obs$ =
      this.type === KeyType.apiKey
        ? this.keyService.apiKeyArr$
        : this.keyService.licenceKeyArr$;

    const sub = obs$.subscribe((keys) => {
      this.userKeys = keys;
    });

    this.subscriptions.push(sub);
  }
}
