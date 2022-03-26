import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { ExerciseCreateComponent } from './components/exercise-create/exercise-create.component';
import { ExerciseUpdateComponent } from './components/exercise-update/exercise-update.component';
import { StudentComponent } from './components/student/student.component';
import { StudentCreateComponent } from './components/student-create/student-create.component';
import { StudentUpdateComponent } from './components/student-update/student-update.component';
import { GraphEditorComponent } from './components/graph-editor/graph-editor.component';
import { GraphViewerComponent } from './components/graph-viewer/graph-viewer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  {path: 'exercises', component: ExerciseComponent },
  {path: 'exercises/:id', component: ExerciseUpdateComponent},
  {path: 'exercise-create', component: ExerciseCreateComponent},
  {path: 'students', component: StudentComponent },
  {path: 'students/:id', component: StudentUpdateComponent},
  {path: 'student-create', component: StudentCreateComponent},
  {path: 'graph-viewer/:id', component: GraphViewerComponent},
  {path: 'graph-editor/:id', component: GraphEditorComponent},
  {path: 'users', component: UserComponent },
  {path: "login",component: LoginComponent},
  {path: "register",component: RegisterComponent},
  {path: "",redirectTo:"login",pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
