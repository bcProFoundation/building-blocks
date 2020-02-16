import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from './dialog-data.interface';

@Component({
  selector: 'app-rename-auth-key-dialog',
  templateUrl: './rename-auth-key-dialog.html',
})
export class RenameAuthKeyDialog {
  constructor(
    public dialogRef: MatDialogRef<RenameAuthKeyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(undefined);
  }
}
