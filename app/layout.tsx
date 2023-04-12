import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
