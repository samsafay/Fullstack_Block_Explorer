import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class Block {
  // @PrimaryGeneratedColumn("uuid")
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsNumber()
  number: number;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  hash: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  num_of_transactions: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  size: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  gasLimit: number;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  timestamp: number;

  @OneToMany(() => Transaction, (transaction) => transaction.block, { cascade: true })
  transactions: Transaction[];  // One-to-many relation with transactions


}
