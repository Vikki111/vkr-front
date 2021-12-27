import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseCreateComponent } from './exercise-create.component';

describe('ExerciseCreateComponent', () => {
  let component: ExerciseCreateComponent;
  let fixture: ComponentFixture<ExerciseCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
