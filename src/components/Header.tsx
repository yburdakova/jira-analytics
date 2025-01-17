import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="p-4 border-b-2  border-gray-200">
      <div>
        <Link href={`/`} className='flex gap-4 content-center'>
          <Image src="/CCSLogo.png" alt="" width={200} height={56} className="h-auto w-auto"/>
          <h1 className="text-3xl font-bold cursor-pointer hover:underline content-center">
            Jira Analytics Dashboard
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
