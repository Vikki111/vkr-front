import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../../components/student/student';
import { StudentFilter } from '../../components/student/studentFilter';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = 'http://localhost:8080/students';

  constructor(private http: HttpClient) { }

  getStudent(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`, {});
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}`, student);
  }

  findStudents(studentFilter: StudentFilter): Observable<Student[]> {
      return this.http.post<Student[]>(`${this.baseUrl}/find`, studentFilter);
    }

  validateGraph(student: Student): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/validate`, student);
  }

  updateStudent(id: string, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/${id}`, student, {});
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {});
  }

  getStudentsList(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}`, {});
  }
}
