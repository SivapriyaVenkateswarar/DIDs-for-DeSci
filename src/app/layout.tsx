import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'DeSci Reputation Prototype',
  description: 'Identity and DID layer',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
        <header style={{ padding: '1rem', backgroundColor: '#f5f5f5' }}>
          <h1>DeSci Reputation Prototype</h1>
        </header>
        <main style={{ padding: '2rem' }}>{children}</main>
      </body>
    </html>
  );
}
