import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router,ActivatedRoute } from "@angular/router";
import {AlertService } from "src/app/services/alert.service";
import { AuthService } from "src/app/services/auth.service";
import { first } from 'rxjs/operators';
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  showErrorMessage=false;
  loginForm: FormGroup;
  returnUrl: string;
  loading = false;
  submitted = false;

  constructor(private authService: AuthService, private alertService: AlertService,private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
  });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/after-connect';
  }
 // convenience getter for easy access to form fields
 get f() { return this.loginForm.controls; }
  createFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
  }

  login(): void {
    this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
    this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .pipe(first())
      .subscribe(
        data => {
         if(data)
          {this.alertService.success("login successfully");
            this.router.navigate([this.returnUrl]);
          }
          else{
            this.alertService.error("wrong credentiels");
           this.showErrorMessage = true;
          }
        },
        );
  }
}
