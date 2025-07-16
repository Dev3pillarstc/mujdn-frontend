import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentTreeComponent } from './department-tree.component';

describe('DepartmentTreeComponent', () => {
  let component: DepartmentTreeComponent;
  let fixture: ComponentFixture<DepartmentTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
