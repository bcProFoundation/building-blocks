import { Entity, BaseEntity, Index, ObjectIdColumn, Column } from 'typeorm';

@Entity()
@Index(['user'], { unique: true })
export class EmailAccount extends BaseEntity {
  @ObjectIdColumn()
  id: string;
  @Column()
  host: string;
  @Column()
  user: string;
  @Column()
  pass: string;
  @Column()
  secure: boolean;
  @Column()
  port: number;
  @Column()
  pool: boolean;
  @Column()
  tlsRejectUnauthorized: boolean;
}
