import { Component, OnInit } from '@angular/core';
import { ScopeService } from './scope.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NEW_ID, DURATION } from '../../constants/common';
import { FormGroup, FormControl } from '@angular/forms';
import {
  CREATE_SUCCESSFUL,
  CLOSE,
  CREATE_ERROR,
  UPDATE_SUCCESSFUL,
  UPDATE_ERROR,
} from '../../constants/messages';
import { MatSnackBar } from '@angular/material/snack-bar';

export const SCOPE_LIST_ROUTE = '/scope/list';

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
    private router: Router,
    private snackBar: MatSnackBar,
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
        next: success => {
          this.snackBar.open(CREATE_SUCCESSFUL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl(SCOPE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(CREATE_ERROR, CLOSE, { duration: DURATION }),
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
        next: success => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl(SCOPE_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(UPDATE_ERROR, CLOSE, { duration: DURATION }),
      });
  }

  populateScopeForm(scope) {
    this.uuid = scope.uuid;
    this.name = scope.name;
    this.scopeForm.controls.name.setValue(scope.name);
    this.scopeForm.controls.description.setValue(scope.description);
  }
}
