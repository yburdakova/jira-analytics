import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <header className="p-4 border-b-2 border-gray-200">
      <div className="container mx-auto">
        <Link href={`/`} className='pointer-events-auto'>
          <h1 className="text-xl font-bold">Jira Analytics Dashboard</h1>
        </Link>
      </div>
    </header>
  )
}

export default Header