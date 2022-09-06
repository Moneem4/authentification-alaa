import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl, FormGroup, Validators, NgForm } from "@angular/forms";

import { first } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
import { User } from '../../models/User';

@Component({
  selector: "app-after-connect",
  templateUrl: "./after-connect.component.html",
  styleUrls: ["./after-connect.component.scss"],
})
export class AfterConnectComponent implements OnInit {
  @ViewChild("formDirective") formDirective: NgForm;
  @Output() create: EventEmitter<any> = new EventEmitter();

  form: FormGroup;

  isOpen = false;
  currentUser: string;
  constructor(
    private authService: AuthService,
  ) {
    this.currentUser = this.authService.currentUserValue;
    console.log("user ",this.currentUser)
  }


  ngOnInit(): void {
    this.form = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      title: new FormControl("", [
        Validators.required,
        Validators.minLength(5),
      ]),
      body: new FormControl("", [
        Validators.required,
        Validators.minLength(10),
      ]),
    });
  }


}
