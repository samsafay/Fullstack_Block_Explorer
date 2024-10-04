import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { z } from 'zod'

export const TransactionSchema = z.object({
  id: z.number(),
  hash: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.number(),
  txnFee: z.number(),
})

export type Transaction = z.infer<typeof TransactionSchema>

interface TransactionState {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
  fetchTransactions: (blockId: number) => Promise<void>
}

const useTransactionStore = create<TransactionState>()(
  devtools(
    (set) => ({
      transactions: [],
      isLoading: false,
      error: null,
      fetchTransactions: async (blockId: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`http://localhost:3232/transactions/block/${blockId}`)
          if (!response.ok) {
            throw new Error('Failed to fetch transactions')
          }
          const data = await response.json()
          const transactions = z.array(TransactionSchema).parse(data)
          set({ transactions, isLoading: false })
        } catch (err) {
          console.error(err)
          set({ error: 'Failed to fetch transactions. Please try again.', isLoading: false })
        }
      },
    }),
    { name: 'TransactionStore' }
  )
)

export default useTransactionStore