import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  private apiService = inject(DataService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  loginForm = this.formBuilder.group({
    userId: ['', Validators.required],
    password: ['', Validators.required]
  });

  ngOnInit() {
    this.preloadLogin();
  }

  preloadLogin(){
    this.loginForm.setValue({
      userId: "dzhen123",
      password: "devon123"
    });
  }

  getLogin(uid: any, pwd: any){
    this.apiService.getPersonByUidandPwd(uid, pwd).subscribe((data: any)=>{
      console.log("Results: "+JSON.stringify(data,null, 2))
      console.log("ssn: "+JSON.stringify(data.ssn));
      if(!data.ssn){
        console.log("Login Failed");
      }else{
        sessionStorage.setItem("loginSession",'true');
        this.router.navigate(['/personList']);
      }
    })
  }

  storing(userId:any){
    localStorage.clear();
    //Stores in different keys
    localStorage.setItem('username', userId);
    let item = localStorage.getItem('username');

    console.log("Login Credentials = "+JSON.stringify(item));
  }

  onSubmit(){
    console.log("Profile Form Data \n"+JSON.stringify(this.loginForm.value,null, 2));
    this.getLogin(this.loginForm.value.userId, this.loginForm.value.password);
  }
}
