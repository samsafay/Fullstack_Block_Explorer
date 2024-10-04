import React, { useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useTransactionStore from '@/store/useTransactionStore';
import { Block } from '@/store/useBlockStore';


function TransactionDetails({ block }: { block: Block }) {
  const { transactions, isLoading, error, fetchTransactions } = useTransactionStore()

  useEffect(() => {
    fetchTransactions(block.id)
  }, [block.id, fetchTransactions])

  if (isLoading) {
    return <p>Loading transactions...</p>
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Hash</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Value (ETH)</TableHead>
          <TableHead>Transaction Fee (ETH)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.id}>
            <TableCell className="font-mono">{tx.hash}</TableCell>
            <TableCell className="font-mono">{tx.from}</TableCell>
            <TableCell className="font-mono">{tx.to}</TableCell>
            <TableCell>{tx.value} ETH</TableCell>
            <TableCell>{tx.txnFee} ETH</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TransactionDetails;