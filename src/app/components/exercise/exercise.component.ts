import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { ExerciseService } from "../../components/exercise/exercise.service";
import { Exercise } from '../../components/exercise/exercise';
import { ActivatedRoute, Router } from '@angular/router';
// import { TokenStorageService } from '../../token-storage.service';

@Component({
  selector: 'app-exercise',
  templateUrl: '../../components/exercise/exercise.component.html',
  styleUrls: ['../../components/exercise/exercise.component.css']
})
export class ExerciseComponent implements OnInit {
   exercises: Observable<Exercise[]>;
//    roles: string[] = [];
//    isAdmin = false;

  constructor(
//   private tokenStorageService: TokenStorageService,
  private exerciseService: ExerciseService, private route: ActivatedRoute,
                                                            private router: Router) {
      this.exercises = this.exerciseService.getExercisesList() //?
  };

  ngOnInit(): void {
    this.exercises = this.exerciseService.getExercisesList();
//     this.roles = this.tokenStorageService.getUser().roles;
//         if(this.roles[0] == "ROLE_ADMIN") {
//             this.isAdmin = true;
//           }
  }

  reloadData() {
    this.exercises = this.exerciseService.getExercisesList();
  }

  updateExercise(id: number){
      this.router.navigate(['exercises', id]);
  }

  createExercise(){
        this.router.navigate(['exercise-create']);
  }

  deleteExercise(id: number) {
    this.exerciseService.deleteExercise(id)
    .subscribe(
        data => {
          console.log(data);
          this.reloadData();
        },
        error => console.log(error));
  }

  logout(): void {
//        this.tokenStorageService.signOut();
       window.location.reload();
     }
}
