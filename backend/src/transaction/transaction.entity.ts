import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Block } from '../block/block.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column()
  hash: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  from: string;

  @IsString()
  @Column()
  to: string;

  @IsNotEmpty()
  @IsString()
  @Column()
  value: number;

  @IsNotEmpty()
  @IsString()
  @Column()
  txnFee: number;

  @ManyToOne(() => Block, (block) => block.transactions, { onDelete: 'CASCADE' })
  block: Block;  // Reference to the block this transaction belongs to
}
