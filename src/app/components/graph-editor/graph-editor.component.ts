import { Component, OnInit } from '@angular/core';
import { Student } from '../../components/student/student';
import { StudentService } from "../../components/student/student.service";
import { Exercise } from '../../components/exercise/exercise';
import { ExerciseService } from "../../components/exercise/exercise.service";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../token-storage.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-graph-editor',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.css']
})
export class GraphEditorComponent implements OnInit {

    id: string;
    validateResponse: string;
    student: Student = new Student();
    exercise: Exercise = new Exercise();

  constructor(private tokenStorageService: TokenStorageService,
      private studentService: StudentService,
      private exerciseService: ExerciseService,
      private route: ActivatedRoute,
      private router: Router) {
     }

  ngOnInit() {
        this.student = new Student();
        this.exercise = new Exercise();
        this.id = this.route.snapshot.params['id'];


        this.studentService.getStudent(this.id)
          .subscribe(data => {
            this.student = data;
            this.exerciseService.getExercise(data.exerciseId)
                          .subscribe(data => {
                            this.exercise = data;
                            console.log(this.exercise);
                          }, error => console.log(error));
          }, error => console.log(error));
      }


      save() {
      //в js скрипте
      }

      validate() {
          this.studentService.validateGraph(this.student).subscribe( data =>{
             this.validateResponse = data;
           },
           error => {
             this.validateResponse = error.error.text;
           });
      }

      onSubmit() {
      }

      gotoList() {
        this.router.navigate(['students']);
      }

      logout(): void {
           this.tokenStorageService.signOut();
           window.location.reload();
         }

     downloadFile(fileName: string): void {
         this.exerciseService.download(fileName)
           .subscribe(blob => saveAs(blob, fileName));
       }
}
