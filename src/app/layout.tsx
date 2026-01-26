import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Campusmeals - Track Your Food Journey',
  description: 'Log meals, discover restaurants, and connect with fellow food lovers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans bg-white text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
