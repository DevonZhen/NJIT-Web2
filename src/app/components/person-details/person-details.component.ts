import { Component, inject, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray, FormGroup, Form } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-person-details',
  providers: [provideNativeDateAdapter()],
  imports: [MatSelectModule,MatInputModule, MatFormFieldModule, MatDatepickerModule, MatButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './person-details.component.html',
  styleUrl: './person-details.component.css'
})
export class PersonDetailsComponent implements OnInit {
  updateFlag:boolean =  false;
  result;
  dataSource;
  

  private apiService = inject(DataService);
  private formBuilder = inject(FormBuilder); 
  private route = inject(ActivatedRoute);
  private snackbar = inject(MatSnackBar)
  
  constructor(){}
  
  profileForm = this.formBuilder.group({
    id: [''],
    uid: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: [''],
    personTypeId: [''],
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
      emgContactId: [''],
      contactName: [''],
      contactRelation: [''],
      contactPhone: [''],
      contactEmail: ['',[Validators.email]],
    }),
    phones: this.formBuilder.array([
      this.newPhone()
    ]),
  });

  ngOnInit() {
    console.log("SSN: "+this.route.snapshot.paramMap.get('ssn'));
    if(this.route.snapshot.paramMap.get('ssn') != null){
      this.getPersonDetails(this.route.snapshot.paramMap.get('ssn'));
      this.updateFlag=true;
    }
  }

  //Reset Form
  reset(){
    this.profileForm.reset();
  }

  
  onSubmit(){
    console.log("Profile Form Data \n"+JSON.stringify(this.profileForm.value,null, 2));
    this.postPerson(this.profileForm.value);
  }

  //Post Person
  postPerson(data: any){
    // data = {
    //   "id": "",
    //   "uid": "ftime123",
    //   "password": "forbes123",
    //   "confirmPassword": "forbes123",
    //   "personTypeId": "1",
    //   "firstName": "Forbes",
    //   "lastName": "Times",
    //   "ssn": "123456798",
    //   "birthday": "2025-01-12T01:42:49.659Z",
    //   "address": {
    //     "id": "",
    //     "street": "1 Pondering Rd",
    //     "city": "Water City",
    //     "state": "NJ",
    //     "zip": "08550"
    //   },
    //   "emgContact": {
    //     "emgContactId": "",
    //     "contactName": "Jerico",
    //     "contactRelation": "Guardian",
    //     "contactPhone": "6098885555",
    //     "contactEmail": "j@gmail.com"
    //   },
    //   "phones": [
    //     {
    //       "id": "",
    //       "phone": "6091113333",
    //       "phoneType": "Cell"
    //     }
    //   ]
    // };
    // console.log("POSTING PERSON...\n"+JSON.stringify(data,null,2))

    this.apiService.postPerson(data).subscribe((data: any)=>{
      if(data){
        this.snackbar.open("Person has been saved successfully!", 'close',  {
          duration: 5 * 1000,
          panelClass: ['mat-toolbar', 'mat-primary'] 
        });
      }else{
        this.snackbar.open("Person has been saved successfully!", 'close',  {
          duration: 5 * 1000,
          panelClass: ['mat-toolbar', 'mat-warn'] 
        });
      }
    },error=>{
      console.log("Error postPerson()", error);
    })
  }

  //Preload Person Details into UI
  loadPersonDetailForm(data){
    this.profileForm.patchValue({
      "id": data.id,
      "uid": data.uid,
      "password": data.password,
      "confirmPassword": data.password,
      "personTypeId": data.personId,
      "firstName": data.firstName,
      "lastName": data.lastName,
      "ssn": data.ssn,
      "birthday": data.birthday,
      'address': {
        'id': data.address.addressId,
        'street': data.address.street,
        'city': data.address.city,
        'state': data.address.state,
        'zip': data.address.zip,
      },
      'emgContact':{
        'emgContactId': data.emgContact.emgContactId,
        'contactName': data.emgContact.contactName,
        'contactRelation': data.emgContact.contactRelation,
        'contactPhone': data.emgContact.contactPhone,
        'contactEmail': data.emgContact.contactEmail
      }
    });
    this.phones.clear();
    data.phones.forEach(item => {
      const phone = this.formBuilder.group({
        'id': item.id,
        'phone': item.phone,
        'phoneType': item.phoneType,
      })
      this.phones.push(phone);
    });
  }

  getPersonDetails(ssn){
    this.apiService.getPersonDetailData(ssn).subscribe((data: any)=>{
      this.dataSource = data;
      this.result = JSON.stringify(data);
      console.log("Results: "+JSON.stringify(this.dataSource, null, 2))
      //Load the Person's Data into UI
      this.loadPersonDetailForm(data)
    })
  }

  get phones() : FormArray {
    return this.profileForm.get("phones") as FormArray
  }

  newPhone(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      phone: [''],
      phoneType: [''],
    })
 }

  addPhone(){
    this.phones.push(this.newPhone());
  }

  deletePhone(i: number){
    this.phones.removeAt(i);
  }
}
