import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesConfigurationModalComponent } from './devices-configuration-modal.component';

describe('DevicesConfigurationModalComponent', () => {
  let component: DevicesConfigurationModalComponent;
  let fixture: ComponentFixture<DevicesConfigurationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevicesConfigurationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevicesConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
