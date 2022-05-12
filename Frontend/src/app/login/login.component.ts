import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup; 
  errorMessage: string="";

  constructor(private http: HttpClient, private router:Router) { }

  ngOnInit(): void {

    this.loginForm=new FormGroup({
      'username' : new FormControl('admin', Validators.required),
      'password' : new FormControl('admin', Validators.required)
    });

  }
  onSubmit(postData: { username: string; password: string }) {    
    this.http.post('http://localhost:8081/authenticate',{"username": postData.username, "password": postData.password})
      .subscribe(responseData => {    
        localStorage.setItem('jwt_token', JSON.parse(JSON.stringify(responseData))['jwt']);
        localStorage.setItem('expiration_time', (Date.now() + 1000 * 60 * 15 )+'');
        this.router.navigate(['/home']);
      },err => {
        if(err.status==500){
          this.errorMessage="Invalid Username/Password";
        }else{
          this.errorMessage="Something went wrong";
        }
      });      
  }
}
