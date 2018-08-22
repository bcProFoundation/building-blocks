import { Entity, Column, Index } from 'typeorm';
import { DocType } from '../base.doctype';

@Entity()
@Index(['email', 'phone'], { unique: true })
export class User extends DocType {
  @Column()
  disabled: boolean = false;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  /**
   * Store UUID of AuthData
   */
  @Column()
  password: string;

  @Column()
  roles: string[];
}
