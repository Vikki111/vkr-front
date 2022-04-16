import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { UserService } from "../../components/user/user.service";
import { User } from '../../components/user/user';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../token-storage.service';

@Component({
  selector: 'app-user',
  templateUrl: '../../components/user/user.component.html',
  styleUrls: ['../../components/user/user.component.css']
})
export class UserComponent implements OnInit {
   users: Observable<User[]>;
   roles: string[] = [];
   isAdmin = false;

  constructor(
  private tokenStorageService: TokenStorageService,
  private userService: UserService, private route: ActivatedRoute,
                                                            private router: Router) {
      this.users = this.userService.getUsersList();
  };

  ngOnInit(): void {
    this.users = this.userService.getUsersList();
    this.roles = this.tokenStorageService.getUser().roles;
        if(this.roles[0] == "ROLE_ADMIN") {
            this.isAdmin = true;
          }
  }

  reloadData() {
    this.users = this.userService.getUsersList();
  }

  deleteUser(id: string) {
    this.userService.deleteUser(id)
    .subscribe(
        data => {
          this.reloadData();
        },
        error => console.log(error));
  }

  logout(): void {
       this.tokenStorageService.signOut();
       window.location.reload();
     }
}
