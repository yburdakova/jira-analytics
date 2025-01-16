import React from 'react'
import Image from 'next/image'
import { LoaderProps } from '@/types/Loader'

const Loader = ({ note }: LoaderProps) => {
  return (
    <div className="fixed inset-0 flex flex-col gap-3 items-center justify-center bg-background/10 z-50">
      <div className=""> {note} </div>
      <Image
        src="/logo_loader.gif"
        width={48}
        height={48}
        alt="Loader"
        className="w-12 h-12"
      />
    </div>
  )
}

export default Loader