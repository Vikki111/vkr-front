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
import { GraphEditorComponent } from './components/graph-editor/graph-editor.component';
import { GraphViewerComponent } from './components/graph-viewer/graph-viewer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

import { authInterceptorProviders } from './hlp/auth.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    StudentCreateComponent,
    StudentUpdateComponent,
    ExerciseComponent,
    ExerciseCreateComponent,
    ExerciseUpdateComponent,
    GraphEditorComponent,
    GraphViewerComponent,
    LoginComponent,
    RegisterComponent
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
    providers: [authInterceptorProviders],
    bootstrap: [AppComponent]
})
export class AppModule { }
