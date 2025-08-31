import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesLocationModalComponent } from './devices-location-modal.component';

describe('DevicesLocationModalComponent', () => {
  let component: DevicesLocationModalComponent;
  let fixture: ComponentFixture<DevicesLocationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevicesLocationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevicesLocationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
