import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentHeaderComponent } from './department-header.component';

describe('DepartmentHeaderComponent', () => {
  let component: DepartmentHeaderComponent;
  let fixture: ComponentFixture<DepartmentHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
