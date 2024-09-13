import {Inter} from 'next/font/google';
import './globals.css';
import AlertProvider from '@/context/AlertContext';

const inter = Inter ({subsets: ['latin']});

export const metadata = {
  title: 'Bensa Hospital | BHPFMS',
  description: 'Patient File Managment System',
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AlertProvider>
          {children}
        </AlertProvider>
      </body>
    </html>
  );
}
