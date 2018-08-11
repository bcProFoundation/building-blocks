import { Entity, Column, BaseEntity, ObjectIdColumn } from 'typeorm';

@Entity()
export class AuthData extends BaseEntity {
  @ObjectIdColumn()
  id: string;

  @Column()
  password: string;
}
