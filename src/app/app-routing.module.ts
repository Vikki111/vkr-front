import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { ExerciseCreateComponent } from './components/exercise-create/exercise-create.component';
import { ExerciseUpdateComponent } from './components/exercise-update/exercise-update.component';
import { StudentComponent } from './components/student/student.component';
import { StudentCreateComponent } from './components/student-create/student-create.component';

const routes: Routes = [
  {path: 'exercises', component: ExerciseComponent },
  {path: 'exercises/:id', component: ExerciseUpdateComponent},
  {path: 'exercise-create', component: ExerciseUpdateComponent},
  {path: 'students', component: StudentComponent },
  {path: 'student-create', component: StudentCreateComponent},
  {path: "", redirectTo: "login", pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
