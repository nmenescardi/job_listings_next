import './globals.css';
import Profile from '@/components/Icons/Profile';

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
    <html lang="en">
      <body>
        <div>
          <header className="w-full py-3 bg-gray-50 shadow-sm">
            <div className="flex items-center justify-between m-auto lg:mx-[6rem]">
              <div>
                <h1>Job Listings</h1>
              </div>

              <div>
                <Profile />
              </div>
            </div>
          </header>

          {children}
        </div>
      </body>
    </html>
  );
}
