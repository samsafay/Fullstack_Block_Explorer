import { Controller, Get, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Transaction } from './transaction.entity';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @ApiOperation({ summary: 'Get all transactions for a given block ID' })
  @ApiParam({ name: 'blockId', description: 'The ID of the block' })
  @ApiResponse({ status: 200, description: 'List of transactions for the block', type: [Transaction] })
  @Get('/block/:blockId')
  async getTransactionsByBlock(@Param('blockId') blockId: number): Promise<Transaction[]> {
    return this.transactionService.getTransactionsByBlock(blockId);
  }
}
