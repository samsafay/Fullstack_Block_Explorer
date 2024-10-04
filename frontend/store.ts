// // store.ts
// import { create } from 'zustand'
// import axios from 'axios'

// interface Block {
//   hash: string
//   number: number
//   timestamp: number
//   transactions: number
// }

// interface BlockStore {
//   blocks: Block[]
//   sortColumn: keyof Block
//   sortDirection: 'asc' | 'desc'
//   loading: boolean
//   error: string | null
//   fetchBlocks: () => Promise<void>
//   deleteBlock: (hash: string) => Promise<void>
//   clearAllBlocks: () => Promise<void>
//   setSortColumn: (column: keyof Block) => void
//   setSortDirection: (direction: 'asc' | 'desc') => void
// }

// export const useBlockStore = create<BlockStore>((set, get) => ({
//   blocks: [],
//   sortColumn: 'number',
//   sortDirection: 'desc',
//   loading: false,
//   error: null,
//   fetchBlocks: async () => {
//     set({ loading: true, error: null })
//     try {
//       const { sortColumn, sortDirection } = get()
//       const response = await axios.get(`http://localhost:3232/blocks?sort=${sortColumn}&order=${sortDirection}`)
//       set({ blocks: response.data, loading: false })
//     } catch (error) {
//       set({ error: 'Failed to fetch blocks', loading: false })
//     }
//   },
//   deleteBlock: async (hash: string) => {
//     try {
//       await axios.delete(`http://localhost:3232/blocks/hash/${hash}`)
//       const { blocks } = get()
//       set({ blocks: blocks.filter(block => block.hash !== hash) })
//     } catch (error) {
//       set({ error: 'Failed to delete block' })
//     }
//   },
//   clearAllBlocks: async () => {
//     try {
//       await axios.delete('http://localhost:3232/blocks')
//       set({ blocks: [] })
//     } catch (error) {
//       set({ error: 'Failed to clear blocks' })
//     }
//   },
//   setSortColumn: (column: keyof Block) => set({ sortColumn: column }),
//   setSortDirection: (direction: 'asc' | 'desc') => set({ sortDirection: direction }),
// }))