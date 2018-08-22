import {
  Entity,
  Column,
  ObjectIdColumn,
  ObjectID,
  Index,
  BaseEntity,
} from 'typeorm';

@Entity()
export class Scope extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Index({ unique: true })
  @Column()
  name: string;

  @Column()
  description: string;
}
