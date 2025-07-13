import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailsPopupComponent } from './task-details-popup.component';

describe('TaskDetailsPopupComponent', () => {
  let component: TaskDetailsPopupComponent;
  let fixture: ComponentFixture<TaskDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailsPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
