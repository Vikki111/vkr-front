import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { StudentService } from "../../components/student/student.service";
import { Student } from '../../components/student/student';
import { StudentFilter } from '../../components/student/studentFilter';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../token-storage.service';

@Component({
  selector: 'app-student',
  templateUrl: '../../components/student/student.component.html',
  styleUrls: ['../../components/student/student.component.css']
})
export class StudentComponent implements OnInit {
   students: Observable<Student[]>;
   studentFilter: StudentFilter = new StudentFilter();
   roles: string[] = [];
   isAdmin = false;

  constructor(
  private tokenStorageService: TokenStorageService,
  private studentService: StudentService, private route: ActivatedRoute,
                                                            private router: Router) {
      this.students = this.studentService.getStudentsList() //?
  };

  ngOnInit(): void {
    this.students = this.studentService.getStudentsList();
    this.roles = this.tokenStorageService.getUser().roles;
        if(this.roles[0] == "ROLE_ADMIN") {
            this.isAdmin = true;
          }
  }

  reloadData() {
    this.students = this.studentService.getStudentsList();
  }

  viewGraph(id: string){
        this.router.navigate(['graph-viewer', id]);
  }

  updateStudent(id: string){
      this.router.navigate(['students', id]);
  }

  createStudent(){
        this.router.navigate(['student-create']);
  }

  deleteStudent(id: string) {
    this.studentService.deleteStudent(id)
    .subscribe(
        data => {
          this.reloadData();
        },
        error => console.log(error));
  }

  search() {
    this.students = new Observable<Student[]>();
    this.students = this.studentService.findStudents(this.studentFilter);
  }

  logout(): void {
       this.tokenStorageService.signOut();
       window.location.reload();
     }
}
