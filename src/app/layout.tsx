import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ParkCheap SG - Find Cheap Parking in Singapore',
  description: 'Search and compare carpark prices near your destination. Find the cheapest parking in Singapore with real-time availability.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ParkCheap SG',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#059669',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-192.png" />
      </head>
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
