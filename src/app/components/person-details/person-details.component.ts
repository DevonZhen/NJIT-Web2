import { Component, inject, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-person-details',
  providers: [provideNativeDateAdapter()],
  imports: [MatSelectModule,MatInputModule, MatFormFieldModule, MatDatepickerModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './person-details.component.html',
  styleUrl: './person-details.component.css'
})
export class PersonDetailsComponent implements OnInit {
  
  result;
  dataSource;

  private apiService = inject(DataService);
  private formBuilder = inject(FormBuilder); 
  
  constructor(){}

  profileForm = this.formBuilder.group({
    id: [''],
    userId: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: [''],
    pertId: [''],
    firstName: [''],
    lastName: [''],
    ssn: ['', Validators.required],
    birthday: [new Date()],
    address: this.formBuilder.group({
      id: [''],
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
    }),
    emgContact: this.formBuilder.group({
      id: [''],
      contactName: [''],
      contactRelation: [''],
      contactPhone: [''],
      contactEmail: ['',[Validators.email]],
    }),
      phones: this.formBuilder.array([]),
  });



  ngOnInit() {
    this.getPersonDetails('123456789');
  }

  //Reset Form
  reset(){

  }

  
  onSubmit(){

  }

  //Post Person
  postPerson(){

  }

  //Preload Person Details into UI
  loadPersonDetailForm(){

  }

  getPersonDetails(ssn){
    this.apiService.getPersonDetailData(ssn).subscribe((data: any)=>{
      this.dataSource = data;
      this.result = JSON.stringify(data);
      console.log("Results: "+JSON.stringify(this.dataSource))
    })
  }

  getPhones(): FormArray{
    return this.profileForm.get("phones") as FormArray;
  }

  newPhone(): FormGroup{
    return this.formBuilder.group({
      id: [''],
      phone: [''],
      phoneType: [''],
    });
  }

  addPhone(){
    // this.phones.push(this.newPhone());
  }

  deletePhone(){
    // this.phones.removeAt(i);
  }
}
