import { Component, OnInit } from '@angular/core';
import { Exercise } from '../../components/exercise/exercise';
import { ExerciseService } from "../../components/exercise/exercise.service";
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-exercise-create',
  templateUrl: './exercise-create.component.html',
  styleUrls: ['./exercise-create.component.css']
})
export class ExerciseCreateComponent implements OnInit {

  fileToUpload: File | null = null;
  exercise: Exercise = new Exercise();
   constructor(private exerciseService: ExerciseService,
     private router: Router) { }

   ngOnInit(): void {
   }

   saveExercise(){
     this.exerciseService.createExercise(this.exercise).subscribe( data =>{
     this.goToExerciseList();
     this.exerciseService.postFile(this.fileToUpload, data.id).subscribe(data => {
     this.goToExerciseList();
        }, error => {
          console.log(error);
        });
     },
     error => console.log(error));
     this.goToExerciseList();
   }

   goToExerciseList(){
     this.router.navigate(['exercises']);
   }

  handleFileInput(files: FileList) {
      this.fileToUpload = files.item(0);
  }

  onSubmit(){
     this.saveExercise();
  }
}
