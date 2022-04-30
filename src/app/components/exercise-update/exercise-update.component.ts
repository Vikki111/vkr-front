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

   fileToUpload: File | null = null;
   id: string;
   exercise: Exercise = new Exercise();

   constructor(private exerciseService: ExerciseService,
       private route: ActivatedRoute,
       private router: Router) { }

   ngOnInit() {
     this.exercise = new Exercise();
//     this.downloadFile("3.pdf");


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
         this.exerciseService.postFile(this.fileToUpload, this.id).subscribe(data => {
              this.gotoList();
                 }, error => {
                   console.log(error);
                 });
       }, error => console.log(error));
   }

   handleFileInput(files: FileList) {
       this.fileToUpload = files.item(0);
   }

//    downloadFile(fileName: string): void {
//        this.exerciseService.download(fileName)
//          .subscribe(blob => {
//           this.fileToUpload = new File([blob], "3.pdf");
//         });
//         console.log("!!!! ",this.fileToUpload);
//     }

   onSubmit() {
     this.updateExercise();
   }

   gotoList() {
     this.router.navigate(['exercises']);
   }
}
