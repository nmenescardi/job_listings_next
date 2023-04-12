import '@/app/globals.css';
import ProfileMenu from '@/components/Profile/ProfileMenu';
import NavbarMenu from '@/components/Navbar/NavbarMenu';

export const metadata = {
  title: 'Job listings',
  description: 'some job listings',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="w-full py-3 bg-gray-50 shadow-sm">
        <div className="flex items-center justify-between m-auto lg:mx-[6rem]">
          <div>
            <h1 className="text-2xl font-semibold">Job Listings</h1>
          </div>

          <div className="flex items-center">
            <NavbarMenu />

            <ProfileMenu />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
