import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyFormComponent } from './key-form.component';

describe('KeyFormComponent', () => {
  let component: KeyFormComponent;
  let fixture: ComponentFixture<KeyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
