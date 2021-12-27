import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentComponent } from './components/student/student.component';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { StudentCreateComponent } from './components/student-create/student-create.component';
import { ExerciseCreateComponent } from './components/exercise-create/exercise-create.component';
import { ExerciseUpdateComponent } from './components/exercise-update/exercise-update.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    ExerciseComponent,
    StudentCreateComponent,
    ExerciseCreateComponent,
    ExerciseUpdateComponent
  ],
  imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      FormsModule,
      NgbModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
