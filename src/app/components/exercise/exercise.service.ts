import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exercise } from '../../components/exercise/exercise';
import { FileData } from '../../components/exercise/filedata';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  private baseUrl = 'http://localhost:8080/exercises';

  constructor(private http: HttpClient) { }

  download(file: string | undefined): Observable<Blob> {
    console.log(file);
    return this.http.get(`${this.baseUrl}/files/${file}`, {
      responseType: 'blob'
    });
  }

  list(): Observable<FileData[]> {
    return this.http.get<FileData[]>(`${this.baseUrl}/files`);
  }

  postFile(fileToUpload: any, id: number){
      const formData: FormData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      const myHeaders = new HttpHeaders().set('exerciseId', String(id));
      return this.http.post(`${this.baseUrl}/files/save`, formData, { headers: myHeaders });
  }

  getExercise(id: number): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.baseUrl}/${id}`, {});
  }

  createExercise(exercise: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.baseUrl}`, exercise);
  }

  updateExercise(id: number, exercise: Exercise): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.baseUrl}/${id}`, exercise, {});
  }

  deleteExercise(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {});
  }

  getExercisesList(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.baseUrl}`, {});
  }
}
