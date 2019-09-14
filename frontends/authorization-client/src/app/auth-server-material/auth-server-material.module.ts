import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatCardModule,
  MatGridListModule,
  MatListModule,
  MatRadioModule,
  MatSnackBarModule,
  MatButtonToggleModule,
  MatIconModule,
  MatDialogModule,
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatProgressBarModule,
    MatGridListModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDialogModule,
  ],
  exports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatProgressBarModule,
    MatGridListModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatIconModule,
    MatDialogModule,
  ],
  declarations: [],
})
export class AuthServerMaterialModule {}
