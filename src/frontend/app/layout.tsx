import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import Header from '../components/Header';
import Footer from '../components/Footer';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Habit Game - Геймификация привычек',
  description: 'Приложение для геймификации привычек и целей',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-4 pb-8">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 