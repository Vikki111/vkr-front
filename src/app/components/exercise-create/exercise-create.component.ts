import { Component, OnInit } from '@angular/core';
import { Exercise } from '../../components/exercise/exercise';
import { ExerciseService } from "../../components/exercise/exercise.service";
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { FileData } from '../../components/exercise/filedata';

@Component({
  selector: 'app-exercise-create',
  templateUrl: './exercise-create.component.html',
  styleUrls: ['./exercise-create.component.css']
})
export class ExerciseCreateComponent implements OnInit {

  fileToUpload: File | null = null;
  fileList?: FileData[];
 exercise: Exercise = new Exercise();
   constructor(private exerciseService: ExerciseService,
     private router: Router) { }

   ngOnInit(): void {
//     this.getFileList();
   }

   saveExercise(){
    console.log("!! ",this.fileToUpload);
     this.exerciseService.createExercise(this.exercise).subscribe( data =>{
     console.log("!! enter" , data.id);
     this.goToExerciseList();
     this.exerciseService.postFile(this.fileToUpload, data.id).subscribe(data => {
     console.log("!!! enter2");
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
//    onSubmit(){
//      this.saveExercise();
//    }

//   getFileList(): void {
//     this.exerciseService.list().subscribe(result => {
//       this.fileList = result;
//       console.log(this.fileList);
//     });
//   }

//   downloadFile(fileData: FileData): void {
//     this.exerciseService.download(fileData.filename)
//       .subscribe(blob => saveAs(blob, fileData.filename));
//   }

  handleFileInput(files: FileList) {
      this.fileToUpload = files.item(0);

  }
     onSubmit(){
     this.saveExercise();
  }
}
