import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.css'],
})
export class UpdateEmailComponent {
  updateEmailForm = new FormGroup({
    email: new FormControl('', Validators.email),
  });

  constructor() {}
}
