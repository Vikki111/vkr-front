import { Component, OnInit } from '@angular/core';
import { Exercise } from '../../components/exercise/exercise';
import { ExerciseService } from "../../components/exercise/exercise.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-exercise',
  templateUrl: './exercise-update.component.html',
  styleUrls: ['./exercise-update.component.css']
})
export class ExerciseUpdateComponent implements OnInit {

   id: string;
   exercise: Exercise = new Exercise();

   constructor(private exerciseService: ExerciseService,
       private route: ActivatedRoute,
       private router: Router) { }

   ngOnInit() {
     this.exercise = new Exercise();

     this.id = this.route.snapshot.params['id'];

     this.exerciseService.getExercise(this.id)
       .subscribe(data => {
         this.exercise = data;
       }, error => console.log(error));
   }

   updateExercise() {
     this.exerciseService.updateExercise(this.id, this.exercise)
       .subscribe(data => {
         this.exercise = new Exercise();
         this.gotoList();
       }, error => console.log(error));
   }

   onSubmit() {
     this.updateExercise();
   }

   gotoList() {
     this.router.navigate(['exercises']);
   }
}
