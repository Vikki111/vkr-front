import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { StudentComponent } from './components/student/student.component';
import { StudentCreateComponent } from './components/student-create/student-create.component';
import { StudentUpdateComponent } from './components/student-update/student-update.component';
import { ExerciseComponent } from './components/exercise/exercise.component';
import { ExerciseCreateComponent } from './components/exercise-create/exercise-create.component';
import { ExerciseUpdateComponent } from './components/exercise-update/exercise-update.component';


@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    StudentCreateComponent,
    StudentUpdateComponent,
    ExerciseComponent,
    ExerciseCreateComponent,
    ExerciseUpdateComponent
  ],
  imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      RouterModule,
      NgbModule,
      RouterModule,
      FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
