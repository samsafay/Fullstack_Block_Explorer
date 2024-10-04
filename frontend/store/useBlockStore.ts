import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'

export const BlockSchema = z.object({
  id: z.number(),
  number: z.number(),
  hash: z.string(),
  size: z.number(),
  gasLimit: z.number(),
  num_of_transactions: z.number(),
  timestamp: z.number(),
})

export type Block = z.infer<typeof BlockSchema>

export const SortDirectionSchema = z.enum(["ASC", "DESC"])
export type SortDirection = z.infer<typeof SortDirectionSchema>

export const PaginationSchema = z.object({
  page: z.number().min(1),
  limit: z.number().min(1),
  sortBy: z.enum(['number', 'size', 'gasLimit', 'timestamp', 'hash', 'nonce']),
  sortDirection: SortDirectionSchema,
})

interface BlockState {
  blocks: Block[]
  sortColumn: keyof Block
  sortDirection: SortDirection
  currentPage: number
  totalPages: number
  totalBlocks: number
  isLoading: boolean
  error: string | null
  toggleState: { [key: number]: { [key: string]: boolean } }
  setBlocks: (blocks: Block[]) => void
  setSortColumn: (column: keyof Block) => void
  setSortDirection: (direction: SortDirection) => void
  setCurrentPage: (page: number) => void
  setTotalPages: (pages: number) => void
  setTotalBlocks: (blocks: number) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  toggleFormat: (blockId: number, field: string) => void
  fetchBlocks: () => Promise<void>
  deleteBlock: (hash: string) => Promise<void>
  deleteAllBlocks: () => Promise<void>
}

const useBlockStore = create<BlockState>()(
  persist(
    (set, get) => ({
      blocks: [],
      sortColumn: "timestamp",
      sortDirection: "DESC",
      currentPage: 1,
      totalPages: 1,
      totalBlocks: 0,
      isLoading: false,
      error: null,
      toggleState: {},

      setBlocks: (blocks) => set({ blocks }),
      setSortColumn: (column) => set({ sortColumn: column }),
      setSortDirection: (direction) => set({ sortDirection: direction }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setTotalPages: (pages) => set({ totalPages: pages }),
      setTotalBlocks: (blocks) => set({ totalBlocks: blocks }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      toggleFormat: (blockId, field) => set((state) => ({
        toggleState: {
          ...state.toggleState,
          [blockId]: {
            ...state.toggleState[blockId],
            [field]: !state.toggleState[blockId]?.[field]
          }
        }
      })),

      fetchBlocks: async () => {
        const { currentPage, sortColumn, sortDirection } = get()
        set({ isLoading: true, error: null })
        try {
          const paginationParams = PaginationSchema.parse({
            page: currentPage,
            limit: 10,
            sortBy: sortColumn,
            sortDirection: sortDirection,
          })

          const response = await fetch(`http://localhost:3232/blocks?page=${paginationParams.page}&limit=${paginationParams.limit}&sortBy=${paginationParams.sortBy}&sortDirection=${paginationParams.sortDirection}`)
          if (!response.ok) {
            throw new Error('Failed to fetch blocks')
          }
          const rawData = await response.json()
          const data = z.object({
            blocks: z.array(BlockSchema),
            totalPages: z.number(),
            totalBlocks: z.number(),
          }).parse(rawData)

          set({
            blocks: data.blocks,
            totalPages: data.totalPages,
            totalBlocks: data.totalBlocks,
            isLoading: false
          })
        } catch (err) {
          if (err instanceof z.ZodError) {
            set({ error: 'Invalid data received from the server. Please try again later.', isLoading: false })
          } else {
            set({ error: 'An error occurred while fetching blocks. Please try again later.', isLoading: false })
          }
          console.error(err)
        }
      },

      deleteBlock: async (hash: string) => {
        try {
          const response = await fetch(`http://localhost:3232/blocks/hash/${hash}`, {
            method: 'DELETE',
          })
          if (!response.ok) {
            throw new Error('Failed to delete block')
          }
          get().fetchBlocks()
        } catch (err) {
          console.error(err)
          set({ error: 'Failed to delete the block. Please try again.' })
        }
      },

      deleteAllBlocks: async () => {
        try {
          const response = await fetch('http://localhost:3232/blocks', {
            method: 'DELETE',
          })
          if (!response.ok) {
            throw new Error('Failed to delete all blocks')
          }
          set({ currentPage: 1 })
          get().fetchBlocks()
        } catch (err) {
          console.error(err)
          set({ error: 'Failed to delete all blocks. Please try again.' })
        }
      },
    }),
    {
      name: 'block-storage', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)

export default useBlockStore