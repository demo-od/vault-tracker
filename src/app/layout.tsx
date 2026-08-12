import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Vault Expense Tracker',
    description: 'Production-grade monochrome expense tracker',
    icons: {
        icon: '/favicon.svg',
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 antialiased min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}