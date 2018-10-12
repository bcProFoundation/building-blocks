import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ProfileService } from './profile.service';
import { MatDatepickerInputEvent } from '@angular/material';
import { USER_UUID } from '../../constants/storage';
import { UPDATE_BUTTON } from '../../constants/messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  uuid: string;
  fullName: string;
  givenName: string;
  middleName: string;
  familyName: string;
  nickName: string;
  gender: string;
  birthdate: Date;
  picture: string;
  website: string;
  zoneinfo: string;
  locale: string;
  roles: string[] = [];
  groups: string[] = [];
  checked2fa: boolean = true;
  updateConstant = UPDATE_BUTTON;

  personalForm = new FormGroup({
    fullName: new FormControl(this.fullName),
    givenName: new FormControl(this.givenName),
    middleName: new FormControl(this.middleName),
    familyName: new FormControl(this.familyName),
    nickname: new FormControl(this.nickName),
    gender: new FormControl(this.gender),
    birthdate: new FormControl({
      value: this.birthdate,
      disabled: true,
    }),
  });

  profileForm = new FormGroup({
    picture: new FormControl(this.picture),
    website: new FormControl(this.website),
    zoneinfo: new FormControl(this.zoneinfo),
    locale: new FormControl(this.locale),
  });

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.subscribeGetUser();
    this.subscribeGetProfilePersonal();
  }

  subscribeGetUser() {
    this.profileService.getAuthServerUser();
  }

  subscribeGetProfilePersonal() {
    const uuid = localStorage.getItem(USER_UUID);
    this.profileService.getPersonalDetails(uuid);
  }

  updatePersonal() {
    this.profileService.updatePersonalDetails({
      uuid: this.uuid,
      givenName: this.personalForm.controls.givenName.value,
      middleName: this.personalForm.controls.middleName.value,
      familyName: this.personalForm.controls.familyName.value,
      nickname: this.personalForm.controls.nickname.value,
      gender: this.personalForm.controls.gender.value,
      birthdate: this.personalForm.controls.birthdate.value,
    });
    this.profileService.setAuthServerUser({
      name: this.personalForm.controls.fullName.value,
    });
  }
  updateProfile() {}
  enableDisable2fa() {}
  updateBirthdate(type: string, event: MatDatepickerInputEvent<Date>) {
    this.birthdate = event.value;
  }
}
