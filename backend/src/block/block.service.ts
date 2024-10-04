import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Block } from './block.entity';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import axios from 'axios';
import { Transaction } from '../transaction/transaction.entity';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class BlockService {
  private readonly logger = new Logger(BlockService.name);
  private readonly infuraProjectId: string;

  constructor(
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    private transactionService: TransactionService,
    private configService: ConfigService
  ) {
    this.infuraProjectId = this.configService.get<string>('INFURA_PROJECT_ID');
  }

  async getLatestBlock(): Promise<void> {
    try {
      const response = await axios.post(`https://mainnet.infura.io/v3/${this.infuraProjectId}`, {
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: ["latest", true],
        id: 1,
      });

      const blockData = response.data.result;

      // Check if the block with the same hash already exists
      const existingBlock = await this.blockRepository.findOne({
        where: { hash: blockData.hash },
      });

      if (!existingBlock) {
        const block = this.blockRepository.create({
          number: parseInt(blockData.number, 16),
          hash: blockData.hash,
          size: parseInt(blockData.size, 16),
          num_of_transactions: blockData.transactions.length,
          gasLimit: parseInt(blockData.gasLimit, 16),
          timestamp: parseInt(blockData.timestamp, 16),
        });



        const savedBlock = await this.blockRepository.save(block);

        // Extract transaction data from the block
        const transactions: Transaction[] = blockData.transactions.map((tx) => {
          const amount = parseInt(tx.value); // Convert gas from hex to decimal
          const gasUsed = parseInt(tx.gas); // Convert gas from hex to decimal
          const gasPrice = parseInt(tx.gasPrice); // Convert gasPrice from hex to decimal
          const txnFee = gasPrice * gasUsed; // Calculate transaction fee in wei

          return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            // gas: tx.gas,
            // gasPrice: tx.gasPrice,
            value: amount,
            txnFee,
            block: savedBlock,
          };

        });

        await this.transactionService.createTransactions(transactions);

        this.logger.log(`Block #${block.number} saved successfully.`);
      } else {
        this.logger.warn(`Block with hash ${blockData.hash} already exists.`);
      }
    } catch (error) {
      this.logger.error(`Failed to retrieve or save block: ${error.message}`);
    }
  }

  @Interval(1000)
  async updateLatestBlockPeriodically(): Promise<void> {
    // TODO: error handling
    this.logger.log('Checking for new blocks...');
    await this.getLatestBlock();
  }

  async getAllBlocks(): Promise<Block[]> {
    return this.blockRepository.find();
  }

  // Method to get paginated blocks with sorting, total pages, and total blocks
  async getBlocks(
    page: number,
    limit: number,
    sortBy: string,
    sortDirection: 'ASC' | 'DESC',
  ): Promise<{ blocks: Block[], totalBlocks: number, totalPages: number }> {
    const validSortColumns = ['number', 'size', 'gasLimit', 'timestamp', 'hash'];
    if (!validSortColumns.includes(sortBy)) {
      throw new BadRequestException(`Invalid sort column: ${sortBy}. Valid columns are: ${validSortColumns.join(', ')}`);
    }

    const [blocks, totalBlocks] = await this.blockRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { [sortBy]: sortDirection },
    });

    const totalPages = Math.ceil(totalBlocks / limit);

    return { blocks, totalBlocks, totalPages };
  }

  async deleteBlockByHash(hash: string): Promise<void> {
    const block = await this.blockRepository.findOneBy({ hash });
    if (!block) {
      throw new NotFoundException(`Block with hash ${hash} not found`);
    }
    await this.blockRepository.remove(block);
    this.logger.log(`Block with hash ${hash} deleted successfully.`);
  }


  async clearBlocks(): Promise<void> {
    await this.blockRepository.clear();
  }
}
