"use client"

import { useEffect } from "react"

import useBlockStore from "@/store/useBlockStore"
import Header from "@/components/Header"
import BlockCard from "@/components/BlockCard"
import Footer from "@/components/Footer"

export default function Component() {
  const blocks = useBlockStore(state => state.blocks);
  const isLoading = useBlockStore(state => state.isLoading);
  const error = useBlockStore(state => state.error);
  const fetchBlocks = useBlockStore(state => state.fetchBlocks);



  useEffect(() => {
    fetchBlocks()

    const intervalId = setInterval(() => {
      fetchBlocks()
    }, 10000)

    return () => clearInterval(intervalId)
  }, [fetchBlocks])


  if (isLoading && blocks.length === 0) {
    return <div className="text-center mt-8">Loading...</div>
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blocks.map((block, index) => (
          <BlockCard key={block.id} block={block} index={index} />
        ))}
      </div>
      {blocks.length === 0 && !isLoading && (
        <p className="text-center text-gray-500 mt-8">No blocks to display.</p>
      )}
      <Footer />
    </div>
  )
}