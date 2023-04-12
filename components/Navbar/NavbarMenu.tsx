'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const NavbarMenu = () => {
  const { user } = useAuth({ middleware: 'auth' });

  return (
    <>
      {user && (
        <div data-testid="navbar-menu" className="flex gap-8 mx-10">
          <div>
            <Link
              href="/admin/listings"
              className="text-xl font-semibold hover:opacity-75"
            >
              Listings
            </Link>
          </div>
          <div>
            <Link
              href="/admin/tags"
              className="text-xl font-semibold hover:opacity-75"
            >
              Tags
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarMenu;
