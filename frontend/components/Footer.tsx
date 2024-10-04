import React from 'react'
import { Button } from "@/components/ui/button"

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import useBlockStore from '@/store/useBlockStore'

function Footer() {
  const blocks = useBlockStore(state => state.blocks);
  const currentPage = useBlockStore(state => state.currentPage);
  const totalPages = useBlockStore(state => state.totalPages);
  const totalBlocks = useBlockStore(state => state.totalBlocks);
  const setCurrentPage = useBlockStore(state => state.setCurrentPage);
  const fetchBlocks = useBlockStore(state => state.fetchBlocks);


  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    fetchBlocks()
  }

  return (
    <div>
      {blocks.length > 0 && (
        <div className="flex justify-center items-center mt-8 gap-4">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages} (Total Blocks: {totalBlocks})
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default Footer
