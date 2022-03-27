import { Component, OnInit } from '@angular/core';
import { Student } from '../../components/student/student';
import { StudentService } from "../../components/student/student.service";
import { Exercise } from '../../components/exercise/exercise';
import { ExerciseService } from "../../components/exercise/exercise.service";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-student-create',
  templateUrl: './student-create.component.html',
  styleUrls: ['./student-create.component.css']
})
export class StudentCreateComponent implements OnInit {

 student: Student = new Student();
 username: string;
 password: string;
 exercises: Exercise[] = [];

   constructor(private studentService: StudentService,
   private exerciseService: ExerciseService,
     private router: Router,
     private authService: AuthService) {
      this.exerciseService.getExercisesList().subscribe(exercises => this.exercises = exercises);
      }

   ngOnInit(): void {
   }

   saveStudent(){
     this.studentService.createStudent(this.student).subscribe( data =>{
       this.authService.registerWithStudent(this.username, this.password, data.id).subscribe(
             data => {
             },
             err => {
             }
           );

       this.goToStudentList();
     },
     error => console.log(error));
   }

   goToStudentList(){
     this.router.navigate(['students']);
   }

   onSubmit(){
     this.saveStudent();
   }
}
