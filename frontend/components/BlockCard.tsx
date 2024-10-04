import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button"
import useBlockStore, { Block } from '@/store/useBlockStore';
import { BLOCKS_PER_PAGE } from '@/Utils/CONSTS';
import DeleteAlert from './ui/DeleteAlert';
import { useFormatToggle } from '@/hooks/use-format-toggle';
import BlockRow from './BlockRow';
import TransactionDetails from './TransactionDetails';

export enum Format {
  Hex = "Hex",
  Dec = "Dec",
  Time = "Time",
}

export interface FormatToggleState {
  number: Format,
  size: Format,
  timestamp: Format,
  gasLimit: Format,
}


// Main BlockCard Component
interface BlockCardProps {
  block: Block;
  index: number;
}


// Main BlockCard Component
const BlockCard = ({ block, index }: BlockCardProps) => {
  const currentPage = useBlockStore(state => state.currentPage);
  const totalBlocks = useBlockStore(state => state.totalBlocks);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState<boolean>(false);

  const { format, toggleFormat } = useFormatToggle();


  const toggleSizeFormat = useCallback(() => toggleFormat('size'), [toggleFormat]);
  const toggleNumberFormat = useCallback(() => toggleFormat('number'), [toggleFormat]);
  const toggleTimestampFormat = useCallback(() => toggleFormat('timestamp'), [toggleFormat]);
  const toggleGasLimitFormat = useCallback(() => toggleFormat('gasLimit'), [toggleFormat]);

  return (
    <Card key={block.id}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Card {(currentPage - 1) * BLOCKS_PER_PAGE + index + 1} of {totalBlocks}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BlockRow
          label="Size"
          value={block.size}
          formatType={format.size}
          onToggle={toggleSizeFormat}
        />
        <BlockRow
          label="Number"
          value={block.number}
          formatType={format.number}
          onToggle={toggleNumberFormat}
        />
        <BlockRow
          label="Timestamp"
          value={block.timestamp}
          formatType={format.timestamp}
          onToggle={toggleTimestampFormat}
        />
        <BlockRow
          label="GasLimit"
          value={block.gasLimit}
          formatType={format.gasLimit}
          onToggle={toggleGasLimitFormat}
        />
        {/* <p>
          <span className="font-semibold"># of Transactions: </span>
          {block.num_of_transactions} transactions
        </p> */}
        <Dialog open={transactionDialogOpen} onOpenChange={setTransactionDialogOpen}>
          <DialogTrigger asChild>
            <p>
              <span className="font-semibold cursor-pointer"># of Transactions: </span>
              {block.num_of_transactions} transactions
            </p>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Transactions for Block #{block.number}</DialogTitle>
              <DialogTitle>{block.num_of_transactions} Transactions</DialogTitle>
            </DialogHeader>
            <TransactionDetails block={block} />
          </DialogContent>
        </Dialog>
        <p className="text-sm text-gray-500 truncate">Hash: {block.hash}</p>
      </CardContent>
      <CardFooter>
        <DeleteAlert block={block} />
      </CardFooter>
    </Card>
  );
};

export default BlockCard;

