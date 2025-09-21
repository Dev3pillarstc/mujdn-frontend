import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportLogPopupComponent } from './import-log-popup.component';

describe('ImportLogPopupComponent', () => {
  let component: ImportLogPopupComponent;
  let fixture: ComponentFixture<ImportLogPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportLogPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportLogPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
