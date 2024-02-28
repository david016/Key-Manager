import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyItemComponent } from './key-item.component';

describe('KeyItemComponent', () => {
  let component: KeyItemComponent;
  let fixture: ComponentFixture<KeyItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
