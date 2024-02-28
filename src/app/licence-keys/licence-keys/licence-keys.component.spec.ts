import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenceKeysComponent } from './licence-keys.component';

describe('LicenceKeysComponent', () => {
  let component: LicenceKeysComponent;
  let fixture: ComponentFixture<LicenceKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenceKeysComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenceKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
