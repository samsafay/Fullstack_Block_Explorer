import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { toast } from '@/hooks/use-toast'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import useBlockStore from '@/store/useBlockStore'

type SortableColumn = 'number' | 'size' | 'gasLimit' | 'timestamp'

export default function Header() {
  const {
    sortColumn,
    sortDirection,
    setSortColumn,
    setSortDirection,
    setCurrentPage,
    fetchBlocks,
    deleteAllBlocks
  } = useBlockStore()
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)

  const handleSort = (column: SortableColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC")
    } else {
      setSortColumn(column)
      setSortDirection("ASC")
    }
    setCurrentPage(1)
    fetchBlocks()
  }

  const handleDeleteAllBlocks = async () => {
    try {
      await deleteAllBlocks()
      toast({
        title: "All blocks deleted",
        description: "All blocks have been successfully deleted.",
      })
      setDeleteAllDialogOpen(false)
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to delete all blocks. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getSortIcon = (column: SortableColumn) => {
    if (sortColumn !== column) return <ArrowUpDown className="h-4 w-4 ml-2" aria-hidden="true" />
    return sortDirection === "ASC" ?
      <ArrowUp className="h-4 w-4 ml-2" aria-hidden="true" /> :
      <ArrowDown className="h-4 w-4 ml-2" aria-hidden="true" />
  }

  const sortButtons: Array<{ column: SortableColumn; label: string }> = [
    { column: "number", label: "Block Number" },
    { column: "size", label: "Size" },
    { column: "gasLimit", label: "Gas Limit" },
    { column: "timestamp", label: "Timestamp" },
  ]

  return (
    <header className="mb-6">
      <h1 className="text-2xl font-bold mb-4">Ethereum Blocks</h1>
      <div className="flex flex-wrap justify-between mb-4 gap-2">
        <div className="flex flex-wrap gap-2">
          {sortButtons.map(({ column, label }) => (
            <Button
              key={column}
              variant="outline"
              onClick={() => handleSort(column)}
              aria-label={`Sort by ${label}`}
            >
              {label} {getSortIcon(column)}
            </Button>
          ))}
        </div>
        <AlertDialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete All Blocks</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all blocks.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAllBlocks}>
                Yes, delete all blocks
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  )
}