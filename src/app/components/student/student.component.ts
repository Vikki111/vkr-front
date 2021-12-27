import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { StudentService } from "../../components/student/student.service";
import { Student } from '../../components/student/student';
import { ActivatedRoute, Router } from '@angular/router';
// import { TokenStorageService } from '../../token-storage.service';

@Component({
  selector: 'app-student',
  templateUrl: '../../components/student/student.component.html',
  styleUrls: ['../../components/student/student.component.css']
})
export class StudentComponent implements OnInit {
   students: Observable<Student[]>;
//    roles: string[] = [];
//    isAdmin = false;

  constructor(
//   private tokenStorageService: TokenStorageService,
  private studentService: StudentService, private route: ActivatedRoute,
                                                            private router: Router) {
      this.students = this.studentService.getStudentsList() //?
  };

  ngOnInit(): void {
    this.students = this.studentService.getStudentsList();
//     this.roles = this.tokenStorageService.getUser().roles;
//         if(this.roles[0] == "ROLE_ADMIN") {
//             this.isAdmin = true;
//           }
  }

  reloadData() {
    this.students = this.studentService.getStudentsList();
  }

  updateStudent(id: number){
      this.router.navigate(['students', id]);
  }

  createStudent(){
        this.router.navigate(['student-create']);
  }

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id)
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
