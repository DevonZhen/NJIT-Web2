import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { personList } from '../interfaces/personList';
import { personTypes } from '../interfaces/personTypes';

//Other parts of the app can request an instance of the service>>
@Injectable({
  providedIn: 'root'
})

export class DataService {

  hostURL: string = "http://localhost:8080";
  

  constructor(private http: HttpClient) { }

  //Login
  getPersonByUidandPwd(uid:any, pwd:any): Observable<any>{
    return this.http.get(this.hostURL+"/personByUidandPwd/"+uid+"/"+pwd)
  }

  //Get All People ✅
  getPersonAllData(): Observable<any>{
    return this.http.get(this.hostURL+"/findAll");
  }

  //Returns Person Data by SSN
  getPersonDetailData(ssn: any): Observable<any>{
    return this.http.get(this.hostURL+"/personBySsn/"+ssn)
  }

  //Returns All Person Types ✅
  getPersonTypeData(): Observable<personTypes>{
    return this.http.get<personTypes>(this.hostURL+"/personTypes");
  }

  //Returns Phone Types
  getPhoneTypeData(): Observable<any>{
    return this.http.get(this.hostURL+"/phoneTypes")
  }

  //Insert/Update a person & its data
  postPerson(formData: any): Observable<any>{
    return this.http.post(this.hostURL+"/postPerson", formData);
  }  

  //Delete a person & its data
  deletePerson(id: string): Observable<any>{
    return this.http.delete(this.hostURL+"/deletePerson/"+id);
  }
}
