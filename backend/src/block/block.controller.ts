import { Controller, Get, Delete, Query, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { BlockService } from './block.service';
import { Block } from './block.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('blocks')
@Controller('blocks')
export class BlockController {
  constructor(private readonly blockService: BlockService) { }

  @ApiOperation({ summary: 'Get paginated blocks with sorting, total pages, and total blocks' })
  @ApiResponse({ status: 200, description: 'Returns paginated blocks along with total pages and total blocks.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Column to sort by (e.g., number, size, gasLimit, timestamp, hash)' })
  @ApiQuery({ name: 'sortDirection', required: false, enum: ['ASC', 'DESC'], description: 'Sort direction (ASC or DESC)' })
  @Get()
  async getBlocks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'number',
    @Query('sortDirection') sortDirection: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ blocks: Block[], totalBlocks: number, totalPages: number }> {
    return this.blockService.getBlocks(page, limit, sortBy, sortDirection);
  }

  @ApiOperation({ summary: 'Delete a block by hash' })
  @ApiParam({ name: 'hash', description: 'The hash of the block to delete' })
  @ApiResponse({ status: 204, description: 'Block deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Block not found.' })
  @Delete('hash/:hash')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlockByHash(@Param('hash') hash: string): Promise<void> {
    return this.blockService.deleteBlockByHash(hash);
  }

  @ApiOperation({ summary: 'Clear all blocks' })
  @ApiResponse({ status: 204, description: 'All blocks deleted successfully.' })
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearBlocks(): Promise<void> {
    return this.blockService.clearBlocks();
  }
}
