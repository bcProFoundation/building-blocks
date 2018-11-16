import { Component, OnInit } from '@angular/core';
import { ScopeService } from './scope.service';
import { ActivatedRoute } from '@angular/router';
// import { MatSnackBar } from '@angular/material';
import { NEW_ID } from '../constants/common';
import { FormGroup, FormControl } from '@angular/forms';
import { CLIENT_UPDATED, CLIENT_ERROR } from '../constants/messages';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-scope',
  templateUrl: './scope.component.html',
  styleUrls: ['./scope.component.css'],
})
export class ScopeComponent implements OnInit {
  uuid: string;
  name: string;
  description: string;

  scopeForm: FormGroup = new FormGroup({
    name: new FormControl(this.name),
    uuid: new FormControl(this.uuid),
    description: new FormControl(this.description),
  });

  constructor(
    private readonly scopeService: ScopeService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) {
    this.uuid =
      this.route.snapshot.params.id === NEW_ID
        ? null
        : this.route.snapshot.params.id;
  }

  ngOnInit() {
    if (this.uuid && this.uuid !== NEW_ID) {
      this.subscribeGetScope(this.uuid);
    }
  }

  subscribeGetScope(uuid: string) {
    this.scopeService.getScope(uuid).subscribe({
      next: response => {
        if (response) {
          this.populateScopeForm(response);
        }
      },
    });
  }

  createScope() {
    this.scopeService
      .createScope(
        this.scopeForm.controls.name.value,
        this.scopeForm.controls.description.value,
      )
      .subscribe({
        next: (response: { name: string; description: string }) => {
          this.name = response.name;
          this.description = response.description;
        },
        error: error => {
          this.snackbar.open(CLIENT_ERROR, 'Close', { duration: 2500 });
        },
      });
  }

  updateScope() {
    this.scopeService
      .updateScope(
        this.uuid,
        this.scopeForm.controls.name.value,
        this.scopeForm.controls.description.value,
      )
      .subscribe({
        next: (response: { name: string }) => {
          this.name = response.name;
          this.snackbar.open(CLIENT_UPDATED, 'Close', { duration: 2500 });
        },
      });
  }

  populateScopeForm(scope) {
    this.uuid = scope.uuid;
    this.name = scope.name;
    this.scopeForm.controls.name.setValue(scope.name);
    this.scopeForm.controls.description.setValue(scope.description);
  }
}
