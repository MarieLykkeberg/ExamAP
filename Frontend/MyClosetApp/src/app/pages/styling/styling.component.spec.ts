import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StylingComponent } from './styling.component';

describe('StylingComponent', () => {
  let component: StylingComponent;
  let fixture: ComponentFixture<StylingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StylingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StylingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
