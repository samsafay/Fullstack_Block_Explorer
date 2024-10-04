import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from './block.entity';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { HttpModule } from '@nestjs/axios';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Block]), // TypeORM module for Block entity
    HttpModule, // HttpModule allows HttpService injection
    TransactionModule,  // Ensure TransactionModule is imported
  ],
  providers: [BlockService],
  controllers: [BlockController],
})
export class BlockModule { }
