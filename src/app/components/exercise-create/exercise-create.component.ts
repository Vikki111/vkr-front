import { Component, OnInit } from '@angular/core';
import { Exercise } from '../../components/exercise/exercise';
import { ExerciseService } from "../../components/exercise/exercise.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-exercise-create',
  templateUrl: './exercise-create.component.html',
  styleUrls: ['./exercise-create.component.css']
})
export class ExerciseCreateComponent implements OnInit {

 exercise: Exercise = new Exercise();
   constructor(private exerciseService: ExerciseService,
     private router: Router) { }

   ngOnInit(): void {
   }

   saveExercise(){
     this.exerciseService.createExercise(this.exercise).subscribe( data =>{
       console.log(data);
       this.goToExerciseList();
     },
     error => console.log(error));
   }

   goToExerciseList(){
     this.router.navigate(['exercises']);
   }

   onSubmit(){
     console.log(this.exercise);
     this.saveExercise();
   }
}
