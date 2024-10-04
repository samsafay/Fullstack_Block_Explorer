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

import { Button } from "@/components/ui/button"
import {
  Trash2,
} from "lucide-react"
import useBlockStore, { Block } from '@/store/useBlockStore';
import { toast } from '@/hooks/use-toast';


interface DeleteAlertProps {
  block: Block;
}

function DeleteAlert({ block }: DeleteAlertProps) {
  const deleteBlock = useBlockStore(state => state.deleteBlock);

  const [deleteBlockDialogOpen, setDeleteBlockDialogOpen] = useState<number | null>(null)

  const handleDeleteBlock = async (hash: string) => {
    try {
      await deleteBlock(hash)
      toast({
        title: "Block deleted",
        description: "The block has been successfully deleted.",
      })
      setDeleteBlockDialogOpen(null)
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to delete the block. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <AlertDialog open={deleteBlockDialogOpen === block.id} onOpenChange={(isOpen) => setDeleteBlockDialogOpen(isOpen ? block.id : null)}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the selected block.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDeleteBlock(block.hash)}>
            Yes, delete this block
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteAlert
