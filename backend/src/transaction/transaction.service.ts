import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) { }


  async createTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    return this.transactionRepository.save(transactions);
  }
  // Fetch all transactions for the given block
  async getTransactionsByBlock(blockId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { block: { id: blockId } },
      relations: ['block'],
    });
  }
}
