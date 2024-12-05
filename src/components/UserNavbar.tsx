"use client"
import Link from 'next/link';
// import { useAuth } from './c/ontext/auth';

export default function UserNavbar() {
  // const user = useAuth();

  return (
    <nav className="bg-gray-100 border-b shadow-md text-gray-600 py-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-xl font-medium">
          NASFA DBMS
        </Link>
        <div className="flex space-x-4">
          <Link href="/auth" className='text-lg font-light hover:text-gray-800'>
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
