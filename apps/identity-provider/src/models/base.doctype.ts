import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

export abstract class DocType extends BaseEntity {
  @PrimaryGeneratedColumn() id: string;

  @CreateDateColumn() creation: Date;

  @UpdateDateColumn() modified: Date;

  // save user id as string
  @Column() createdBy: string;

  // save user id as string
  @Column() modifiedBy: string;

  @Column() docstatus: number;
}
