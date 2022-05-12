import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  persionerForm!: FormGroup; 
  isDataValid = false;
  isPensionCalculated =false;
  errorMessage: string="";
  jwtToken:string="";
  pensionAmount = "";
  bankCharge = "";
  panNumber="";
  pensionerName=""
  aadharNumber="";
  DOB="";
  selfOrFamily="";
  lastSalery="";
  bankName="";
  bankAccountNumber="";
  bankSector="";

  constructor(private http: HttpClient, private router:Router) { }

  ngOnInit(): void {
    this.isLoggedInUserVerified();
    this.persionerForm=new FormGroup({
      'aadharNumber' : new FormControl(471032686624, Validators.required)
    });       
  }

  isLoggedInUserVerified(){    
    const curTime = (Date.now()+'');
    const expTime = localStorage.getItem("expiration_time");
    if((localStorage.getItem("jwt_token") === null && expTime===null) || (expTime!==null && curTime>expTime)){
      if(confirm("Session Expired click OK to login")) {
        this.router.navigate(['/login']);
      }      
    }
  }

  onSubmit(postData: { aadharNumber : number; }){
    this.isDataValid = false;
    this.isLoggedInUserVerified();
    this.jwtToken='Bearer '+ localStorage.getItem("jwt_token");    
    let headers1 = new HttpHeaders({
      'Access-Control-Allow-Origin' : 'http://localhost:8083',
      'Authorization' : this.jwtToken
   }); 
   let options = {
      headers: headers1
   }   

   this.http.get("http://localhost:8083/PensionerDetailByAadhaar/"+postData.aadharNumber, options ).subscribe(responseData=>{
     if(JSON.parse(JSON.stringify(responseData))['aadharId']==null){
      this.isDataValid = false;
      this.errorMessage="Enter A Valid Aadhar Number";
     }
      this.pensionerName = JSON.parse(JSON.stringify(responseData))['pensionerName'];
      this.panNumber = JSON.parse(JSON.stringify(responseData))['panNumber'];
      this.aadharNumber = JSON.parse(JSON.stringify(responseData))['aadharId'];
      this.DOB = JSON.parse(JSON.stringify(responseData))['dateOfBirth'];
      this.selfOrFamily = JSON.parse(JSON.stringify(responseData))['selfOrFamily'];
      this.lastSalery = JSON.parse(JSON.stringify(responseData))['lastSalary'];
      this.bankName = JSON.parse(JSON.stringify(responseData))['bankName'];
      this.bankAccountNumber = JSON.parse(JSON.stringify(responseData))['accountNumber'];
      this.bankSector = JSON.parse(JSON.stringify(responseData))['publicOrPrivateBank'];
      this.isPensionCalculated=false;
      this.isDataValid = true;
      this.errorMessage = "";
    },err => {
      this.isDataValid = false;
      if(err.status==500){
        this.errorMessage="Enter A Valid Aadhar Number";
      }else{
        this.errorMessage="Something Went Wrong";
      }
    }); 
    


     
  }

  calculateResults(){
    this.isLoggedInUserVerified();
    this.jwtToken='Bearer '+ localStorage.getItem("jwt_token");    
    let headers1 = new HttpHeaders({
      'Access-Control-Allow-Origin' : 'http://localhost:8082',
      'Authorization' : this.jwtToken
   }); 
   let options = {
      headers: headers1
   } 
    this.http.get("http://localhost:8082/ProcessPension/"+this.aadharNumber, options ).subscribe(responseData=>{
      this.pensionAmount = JSON.parse(JSON.stringify(responseData))['pensionAmount'];
      this.bankCharge = JSON.parse(JSON.stringify(responseData))['bankServiceCharge'];
      
      this.errorMessage = "";
      this.isPensionCalculated=true;
    },err => {
      this.isDataValid = false;
      if(err.status==500){
        this.errorMessage="Invalid pensioner detail provided, please provide valid detail.";
      }else{
        this.errorMessage="Something Went Wrong";
      }
    });   
  
  }

  // onSubmit(postData: { aadharNumber : number; }){
  //   this.isLoggedInUserVerified();
  //   this.jwtToken='Bearer '+ localStorage.getItem("jwt_token");    
  //   let headers1 = new HttpHeaders({
  //     'Access-Control-Allow-Origin' : 'http://localhost:8090',
  //     'Authorization' : this.jwtToken
  //  }); 
  //  let options = {
  //     headers: headers1
  //  }   
  //   this.http.get("http://localhost:8090/ProcessPension/"+postData.aadharNumber, options ).subscribe(responseData=>{
  //     this.pensionAmount = JSON.parse(JSON.stringify(responseData))['pensionAmount'];
  //     this.bankCharge = JSON.parse(JSON.stringify(responseData))['bankServiceCharge'];
  //     this.isDataValid = true;
  //     this.errorMessage = "";
  //   },err => {
  //     this.isDataValid = false;
  //     if(err.status==500){
  //       this.errorMessage="Enter A Valid Aadhar Number";
  //     }else{
  //       this.errorMessage="Something Went Wrong";
  //     }
  //   });    
  // }

  logout(){
    this.router.navigate(['/logout']);
  }

}
