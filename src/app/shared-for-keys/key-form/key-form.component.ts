import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { v4 as uuidv4 } from "uuid";
import { Key } from "../../models/key";
import { KeyType } from "../../models/key-types";
import { LicenceKey } from "src/app/licence-keys/licence-key.model";
import { ApiKey } from "src/app/api-keys/api-key.model";
import { AuthService } from "src/app/auth/auth.service";
import { KeyService } from "src/app/services/key.service";

@Component({
  selector: "app-key-form",
  templateUrl: "./key-form.component.html",
  styleUrls: ["./key-form.component.scss"],
})
export class KeyFormComponent implements OnInit, OnDestroy {
  @Input() type: KeyType;
  @Input() selectedKey: Key;
  @Output() closeFormEvent = new EventEmitter();
  listenerFn = () => {};

  generatedKey: string;
  editMode = false;
  keyForm: FormGroup = new FormGroup({});

  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    private keyService: KeyService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initClickListener();
    this.initForm();
  }

  ngOnDestroy(): void {
    this.removeListener();
  }

  onSubmit() {
    const keyPayload = this.createKey(this.keyForm);
    const serviceAction = this.selectedKey
      ? this.keyService.editKey(keyPayload, this.type)
      : this.keyService.addNewKey(keyPayload, this.type);

    serviceAction.subscribe();
    this.onCloseModal();
  }

  onCloseModal() {
    this.selectedKey = null;
    this.generatedKey = "";
    this.closeFormEvent.emit();
  }

  onGenerateKey() {
    this.generatedKey = uuidv4();
  }

  initClickListener() {
    setTimeout(() => {
      this.listenerFn = this.renderer.listen("document", "click", (event) => {
        if (!this.el.nativeElement.contains(event.target)) {
          this.onCloseModal();
        }
      });
    }, 0);
  }

  createKey(form: FormGroup): Key {
    const { name, description } = form.value;
    const key = this.selectedKey?.key || this.generatedKey;
    const keyId = this.selectedKey?.keyId || "";
    const userId = this.authService.authUser.value.localId;
    const timestamp = this.selectedKey?.createdAt || Date.now();

    if (this.type === KeyType.licenceKey) {
      // If there is a selectedKey, use its expirationDate, otherwise calculate it as 30 days from now
      const expirationDate =
        (this.selectedKey as LicenceKey)?.expireAt ||
        Date.now() + 30 * 24 * 60 * 60 * 1000;

      return new LicenceKey(
        name,
        key,
        description,
        userId,
        timestamp,
        expirationDate,
        keyId
      );
    } else {
      return new ApiKey(name, key, description, userId, timestamp, keyId);
    }
  }

  private initForm() {
    const formConfig = this.selectedKey
      ? {
          name: [this.selectedKey.name],
          key: [this.selectedKey.key],
          description: [this.selectedKey.description],
        }
      : { name: [""], key: [""], description: [""] };

    this.keyForm = this.fb.group(formConfig);
  }

  private removeListener(): void {
    this.listenerFn();
  }
}
