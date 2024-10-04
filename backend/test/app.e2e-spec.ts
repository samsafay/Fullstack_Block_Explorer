import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { Block } from './../src/block/block.entity';
import { Transaction } from './../src/transaction/transaction.entity';

describe('App E2E Test Suite', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let blockRepository: Repository<Block>;
  let transactionRepository: Repository<Transaction>;

  beforeAll(async () => {
    // Create the testing module
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Get the DataSource instance
    dataSource = moduleFixture.get<DataSource>(DataSource);

    // Get repositories
    blockRepository = dataSource.getRepository(Block);
    transactionRepository = dataSource.getRepository(Transaction);

    // Create the Nest application
    app = moduleFixture.createNestApplication();

    // Start the application
    await app.init();
  });

  afterAll(async () => {
    // Close the application after tests
    await app.close();
  });

  afterEach(async () => {
    // Clean up the database after each test
    await dataSource.synchronize(true);
  });

  describe('Blocks Module', () => {
    it('should fetch blocks', async () => {
      // Seed the database with some blocks
      const blocks = [];
      for (let i = 1; i <= 5; i++) {
        const block = new Block();
        block.number = i;
        block.hash = `0xblock${i}`;
        block.num_of_transactions = 0;
        block.size = 1000;
        block.gasLimit = 8000000;
        block.timestamp = Math.floor(Date.now() / 1000);
        blocks.push(block);
      }
      await blockRepository.save(blocks);

      const response = await request(app.getHttpServer())
        .get('/blocks')
        .query({ page: 1, limit: 10, sortBy: 'number', sortDirection: 'DESC' })
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('blocks');
      expect(response.body).toHaveProperty('totalBlocks');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.blocks)).toBe(true);
      expect(response.body.blocks.length).toBeGreaterThan(0);
      expect(response.body.blocks.length).toEqual(blocks.length);
    });

    it('should delete a block by hash', async () => {
      // Create a block to delete
      const block = new Block();
      block.number = 1;
      block.hash = '0x1234abcd';
      block.num_of_transactions = 0;
      block.size = 1000;
      block.gasLimit = 8000000;
      block.timestamp = Math.floor(Date.now() / 1000);
      await blockRepository.save(block);

      // Delete the block
      await request(app.getHttpServer())
        .delete(`/blocks/hash/${block.hash}`)
        .expect(HttpStatus.NO_CONTENT);

      // Verify the block has been deleted
      const deletedBlock = await blockRepository.findOneBy({ hash: block.hash });
      expect(deletedBlock).toBeNull();
    });

    it('should clear all blocks', async () => {
      // Seed the database with some blocks
      const blocks = [];
      for (let i = 1; i <= 3; i++) {
        const block = new Block();
        block.number = i;
        block.hash = `0xblock${i}`;
        block.num_of_transactions = 0;
        block.size = 1000;
        block.gasLimit = 8000000;
        block.timestamp = Math.floor(Date.now() / 1000);
        blocks.push(block);
      }
      await blockRepository.save(blocks);

      // Clear all blocks
      await request(app.getHttpServer())
        .delete('/blocks')
        .expect(HttpStatus.NO_CONTENT);

      // Verify all blocks have been deleted
      const remainingBlocks = await blockRepository.find();
      expect(remainingBlocks.length).toBe(0);
    });
  });

  describe('Transactions Module', () => {
    it('should fetch all transactions for a given block ID', async () => {
      // Create a block
      const block = new Block();
      block.number = 1;
      block.hash = '0xblock123';
      block.num_of_transactions = 2;
      block.size = 1000;
      block.gasLimit = 8000000;
      block.timestamp = Math.floor(Date.now() / 1000);
      await blockRepository.save(block);

      // Create transactions
      const transaction1 = new Transaction();
      transaction1.hash = '0xtran1';
      transaction1.from = '0xfrom1';
      transaction1.to = '0xto1';
      transaction1.value = 100;
      transaction1.txnFee = 10;
      transaction1.block = block;

      const transaction2 = new Transaction();
      transaction2.hash = '0xtran2';
      transaction2.from = '0xfrom2';
      transaction2.to = '0xto2';
      transaction2.value = 200;
      transaction2.txnFee = 20;
      transaction2.block = block;

      await transactionRepository.save([transaction1, transaction2]);

      // Fetch transactions by block ID
      const response = await request(app.getHttpServer())
        .get(`/transactions/block/${block.id}`)
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('hash');
      expect(response.body[0]).toHaveProperty('from');
      expect(response.body[0]).toHaveProperty('to');
      expect(response.body[0]).toHaveProperty('value');
      expect(response.body[0]).toHaveProperty('txnFee');
      expect(response.body[0]).toHaveProperty('block');
    });
  });
});
