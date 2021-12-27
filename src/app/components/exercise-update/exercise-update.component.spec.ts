import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseUpdateComponent } from './exercise-update.component';

describe('ExerciseUpdateComponent', () => {
  let component: ExerciseUpdateComponent;
  let fixture: ComponentFixture<ExerciseUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
