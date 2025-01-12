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
import { personTypes } from '../../interfaces/personTypes';
import { phoneTypes } from '../../interfaces/phoneTypes';

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

  personTypes: personTypes[];
  phoneTypes: phoneTypes[];
  

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
    personType:this.formBuilder.group({
      personTypeId: [''],
      personType: [''],
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
    this.getPersonType();
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
    //   "uid": "lray123",
    //   "password": "loran123",
    //   "confirmPassword": "loran123",
    //   "personType": {
    //     "personTypeId": 3,
    //     "personType": ""
    //   },
    //   "firstName": "Loran",
    //   "lastName": "Ray",
    //   "ssn": "159647826",
    //   "birthday": "2025-01-12T01:42:49.659Z",
    //   "address": {
    //     "id": "",
    //     "street": "2 Pondering Rd",
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

    // this.apiService.postPerson(data).subscribe((data: any)=>{
    //   if(data){
    //     this.snackbar.open("Person has been saved successfully!", 'close',  {
    //       duration: 5 * 1000,
    //       panelClass: ['mat-toolbar', 'mat-primary'] 
    //     });
    //   }else{
    //     this.snackbar.open("Person has been saved successfully!", 'close',  {
    //       duration: 5 * 1000,
    //       panelClass: ['mat-toolbar', 'mat-warn'] 
    //     });
    //   }
    // },error=>{
    //   console.log("Error postPerson()", error);
    // })
  }

  //Preload Person Details into UI
  loadPersonDetailForm(data){
    console.log("Patching... "+data.personType.personType);
    this.profileForm.patchValue({
      "id": data.id,
      "uid": data.uid,
      "password": data.password,
      "confirmPassword": data.password,
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
      'personType':{
        'personTypeId':data.personType.personTypeId,
        'personType':data.personType.personType
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

   //Loads the JSON/Dynamic data from Restful <Person Type>
   getPersonType(){
    this.apiService.getPersonTypeData().subscribe((data: any)=>{
      console.log("Person Types: "+JSON.stringify(data, null, 2));
      this.personTypes = data;
    }, err => {
      console.log("(Person Type) Error occured: getPersonType() failed "+err)
    }
  )
  }
}
