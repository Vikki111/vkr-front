import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exercise } from '../../components/exercise/exercise';

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

  postFile(fileToUpload: any, id: string){
      const formData: FormData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      const myHeaders = new HttpHeaders().set('exerciseId', id);
      return this.http.post(`${this.baseUrl}/files/save`, formData, { headers: myHeaders });
  }

  getExercise(id: string): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.baseUrl}/${id}`, {});
  }

  createExercise(exercise: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.baseUrl}`, exercise);
  }

  updateExercise(id: string, exercise: Exercise): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.baseUrl}/${id}`, exercise, {});
  }

  deleteExercise(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {});
  }

  getExercisesList(): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.baseUrl}`, {});
  }
}
