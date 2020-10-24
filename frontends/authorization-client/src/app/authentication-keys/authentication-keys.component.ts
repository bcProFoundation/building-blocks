import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { AuthenticationKeysService } from './authentication-keys.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RenameAuthKeyDialog } from './rename-key-dialog.component';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
  CLOSE,
  DELETING,
  DURATION,
  UNDO,
  UNDO_DURATION,
} from '../constants/app-strings';
import { SOMETHING_WENT_WRONG } from '../constants/messages';

@Component({
  selector: 'app-authentication-keys',
  templateUrl: './authentication-keys.component.html',
  styleUrls: ['./authentication-keys.component.css'],
})
export class AuthenticationKeysComponent implements OnInit {
  userUuid: string;
  accessToken: string;
  keys: any[];
  flagDeleteAuthKey: boolean;
  disableChoice: boolean = false;
  keyForm = new FormArray([]);
  keySelectionForm = new FormGroup({
    keys: this.keyForm,
  });

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private service: AuthenticationKeysService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.userUuid = this.route.snapshot.params.userUuid;
  }

  ngOnInit() {
    this.accessToken = this.route.snapshot.queryParamMap.get('access_token');
    this.location.replaceState(`account/keys/${this.userUuid}`);
    this.loadKeys();
  }

  loadKeys() {
    this.service.getAuthenticators(this.userUuid, this.accessToken).subscribe({
      next: response => this.populateForm(response),
      error: error => this.navigateBack(),
    });
  }

  removeAuthKey(index: number) {
    this.disableChoice = true;
    this.flagDeleteAuthKey = true;
    const snackBar = this.snackBar.open(DELETING, UNDO, {
      duration: UNDO_DURATION,
    });

    snackBar.afterDismissed().subscribe({
      next: dismissed => {
        if (this.flagDeleteAuthKey) {
          this.service
            .removeAuthKey(this.keys[index].uuid, this.accessToken)
            .subscribe({
              next: deleted => {
                this.keyForm.removeAt(index);
                this.keys.splice(index, 1);
                this.disableChoice = false;
              },
              error: error => (this.disableChoice = false),
            });
        }
      },
      error: error => (this.disableChoice = false),
    });

    snackBar.onAction().subscribe({
      next: success => {
        this.flagDeleteAuthKey = false;
        this.disableChoice = false;
      },
      error: error => {
        this.flagDeleteAuthKey = false;
        this.disableChoice = false;
      },
    });
  }

  addAuthKey() {
    this.service.addAuthKey(this.userUuid, this.accessToken).subscribe({
      next: response => {
        this.keys.push({ uuid: response.registered });
        this.addKey({ uuid: response.registered });
      },
      error: error => {
        this.snackBar.open(SOMETHING_WENT_WRONG, CLOSE, { duration: DURATION });
      },
    });
  }

  navigateBack() {
    this.location.back();
  }

  populateForm(keys) {
    this.keys = keys;
    this.keys.forEach(key => this.addKey(key));
  }

  addKey(key) {
    this.keyForm.push(
      new FormGroup({
        uuid: new FormControl(key.uuid),
        name: new FormControl(key.name),
      }),
    );
  }

  renameAuthKey(index: number): void {
    const dialogRef = this.dialog.open(RenameAuthKeyDialog, {
      width: '250px',
      data: {
        name: this.keys[index].name,
        uuid: this.keys[index].uuid,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap(result => {
          if (!result) return of(result);
          return this.service.renameAuthKey(
            this.keys[index].uuid,
            result,
            this.accessToken,
          );
        }),
      )
      .subscribe({
        next: result => {
          if (result) {
            this.keys[index].name = result.name;
            (this.keyForm.controls[index] as FormGroup).controls.name.setValue(
              result.name,
            );
          }
        },
        error: error => {},
      });
  }
}
