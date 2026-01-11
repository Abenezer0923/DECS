import '../globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DECS - Election Calendar',
  description: 'Digital Election Calendar System - Public Portal',
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
               <div className="flex items-center gap-2">
                   <span className="text-2xl">🗳️</span>
                   <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 bg-clip-text text-transparent">
                       NEBE Election Calendar
                   </h1>
               </div>
               <nav className="flex gap-4 text-sm font-medium text-gray-600">
                   <a href="/public/calendar" className="hover:text-primary-600">Calendar</a>
                   <a href="/login" className="hover:text-primary-600">Staff Login</a>
               </nav>
          </div>
      </header>
      <main>
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
              &copy; 2026 National Election Board of Ethiopia. All rights reserved.
          </div>
      </footer>
    </div>
  );
}
