import { Component, OnInit } from '@angular/core';
import { Student } from '../../components/student/student';
import { StudentService } from "../../components/student/student.service";
import { Exercise } from '../../components/exercise/exercise';
import { ExerciseService } from "../../components/exercise/exercise.service";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-graph-viewer',
  templateUrl: './graph-viewer.component.html',
  styleUrls: ['./graph-viewer.component.css']
})
export class GraphViewerComponent implements OnInit {

    id: number;
    student: Student = new Student();
    exercise: Exercise = new Exercise();

   constructor(private studentService: StudentService,
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
                }, error => console.log(error));
          }, error => console.log(error));
    }

    updateStudent() {
      this.studentService.updateStudent(this.id, this.student)
        .subscribe(data => {
          this.student = new Student();
          this.gotoList();
        }, error => console.log(error));
    }

    onSubmit() {
      this.updateStudent();
    }

    gotoList() {
      this.router.navigate(['students']);
    }
}
