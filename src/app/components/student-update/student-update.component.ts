import { Component, OnInit } from '@angular/core';
import { Student } from '../../components/student/student';
import { StudentService } from "../../components/student/student.service";
import { Exercise } from '../../components/exercise/exercise';
import { ExerciseService } from "../../components/exercise/exercise.service";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-student-update',
  templateUrl: './student-update.component.html',
  styleUrls: ['./student-update.component.css']
})
export class StudentUpdateComponent implements OnInit {

    id: number;
    student: Student = new Student();
    exercises: Exercise[] = [];

   constructor(private studentService: StudentService,
    private exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private router: Router) {
      this.exerciseService.getExercisesList().subscribe(exercises => this.exercises = exercises);
   }

    ngOnInit() {
      this.student = new Student();

      this.id = this.route.snapshot.params['id'];

      this.studentService.getStudent(this.id)
        .subscribe(data => {
          console.log(data);
          this.student = data;
        }, error => console.log(error));
    }

    updateStudent() {
      this.studentService.updateStudent(this.id, this.student)
        .subscribe(data => {
          console.log(data);
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
