import { Entity, Column, Index } from 'typeorm';
import { DocType } from '../base.doctype';

@Entity()
@Index(['email', 'phone'], { unique: true })
export class User extends DocType {
  @Column()
  disabled: boolean = false;

  /**
   * User's Full Name
   */
  @Column()
  name: string;

  /**
   * User's phone number E164 format
   */
  @Column()
  phone: string;

  /**
   * User's email address
   */
  @Column()
  email: string;

  /**
   * Store UUID of AuthData
   */
  @Column()
  password: string;

  /**
   * User's roles
   */
  @Column()
  roles: string[];

  /**
   * Enable 2fa, default disabled
   */
  @Column()
  enable2fa: boolean = false;

  /**
   * Shared secret to generate OTP
   */
  @Column()
  sharedSecret: string;

  /**
   * OTP Period, default is 30 sec
   */
  @Column()
  otpPeriod: number = 30;

  /**
   * Stores otp counter to validate otp sent over email or phone
   */
  @Column()
  otpCounter: number;

  /**
   * Key to store temporary 2fa secret
   */
  @Column()
  twoFactorTempSecret: string;
}
