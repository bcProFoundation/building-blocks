import { Column, Entity, BaseEntity, ObjectID, ObjectIdColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class BrandSettings extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  uuid: string;

  @Column()
  logoURL: string;

  @Column()
  privacyURL: string;

  @Column()
  termsURL: string;

  @Column()
  faviconURL: string;

  @Column()
  foregroundColor: string;

  @Column()
  backgroundColor: string;

  @Column()
  helpURL: string;

  @Column()
  primaryColor: string;

  @Column()
  accentColor: string;

  @Column()
  warnColor: string;

  @Column()
  copyrightMessage: string;

  constructor() {
    super();
    if (!this.uuid) {
      this.uuid = uuidv4();
    }
  }
}
